// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var curWorkspace;
  var messageEndpoint = '/api/message';

  // won't work direct due to browser cross-site security policy
  //var rrEndpoint = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc37b37ace_752a_4180_a581_a8c2d2189087/solr/coco_collection/select?q=expression&wt=json&fl=author';

  // gets routed by the server to the above HTTP GET endpoint
  var rrEndpoint = '/api/rr';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      log("response: "+newPayloadStr);
      try {
	      responsePayload = JSON.parse(newPayloadStr);
	      if(responsePayload && responsePayload.output) {
		      if(responsePayload.output.url) {
		    	  document.getElementById("doc").src = responsePayload.output.url;
		    	  //var iframe = document.getElementById("doc").src = "https://www.google.com/webhp?ie=UTF-8#q=intent%20site%3Ahttp%3A%2F%2Fwww.ibm.com%2Fwatson%2Fdevelopercloud%2Fdoc%2Fconversation";
		      }
		      else if(responsePayload.output.rnr) {
		          log("Querying R&R: "+responsePayload.output.rnr);
		    	  sendRRRequest(responsePayload.output.rnr);
		      }
	      }
      }
      catch(e) {
    	  log("error processing conversation response: "+e);
      }
    },
    getWorkspace: function() {
        return curWorkspace;
    },
    setWorkspace: function(wksp) {
        curWorkspace = wksp;
        //alert(curWorkspace);
    },

    displayRRResult: function(rrResponse) {
      log("RR response: "+rrResponse);
      var p = JSON.parse(rrResponse);
      var handled = false;
      try {
	      if(p && p.response && p.response.docs && p.response.docs.length > 0 && p.response.docs[0].author && p.response.docs[0].author.length > 0) {
	    	  var url = p.response.docs[0].author[0];
	          log("Using first doc author as url: "+url);
	      	  document.getElementById("doc").src = url;
  	      	  // TODO display message that some related page was found
	      	  //ConversationPanel.displayMessage({ output: { text: "Found some related content." } }, settings.authorTypes.watson);
	      	  handled = true;
	      }
      }
	  catch (e) {
		log("No luck reading R&R response: "+p);
	  }
      if (!handled) {
    	log("Sorry, no R&R results found");
    	// TODO display message that no related page was found
      }
    }

  };

  function log(msg) {
  	  //document.getElementById("select_wksp").innerText += "\n" + msg;
  }

  // Send a message request to the server
  function sendRequest(text, context) {
    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    if (context) {
      payloadToWatson.context = context;
    }
    if (curWorkspace) {
      payloadToWatson.workspace = curWorkspace;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    //alert("endpoint:"+messageEndpoint);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
      }
    };

    var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }

	log("req:"+params+"\n");
    
    // Send request
    http.send(params);
  }
  
  // Send a message request direct to the R&R server
  function sendRRRequest(text) {
    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', rrEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    //alert("endpoint:"+rrEndpoint);
    // not needed as we don't go direct:
    //http.setRequestHeader('Authorization', 'Basic N2U4M2MyMWUtZDljZi00MzY2LWIzYmEtMGZkOWEwZGRmNzQxOkI3V2ZFT1JBRVpxTA==');
    http.onreadystatechange = function() {
      log("RR state: "+http.readyState+" status: "+http.status +" resp: "+http.responseText);
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.displayRRResult(http.responseText);
      }
    };

    var rrRequest = { text: text };
    var reqBody = JSON.stringify(rrRequest)
    
    log("Requesting RR with: "+reqBody);
    // Send request
    http.send(reqBody);
  }

}());
