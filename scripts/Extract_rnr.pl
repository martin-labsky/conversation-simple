#!/usr/bin/perl

##
# Generated link to anchors in doc
#
# author: Jan Curin <jan_curin@cz.ibm.com>
##

use strict;
use JSON;

## beginning of main

my @files = `ls -1 *.md`;

open RNR, ">rnr.json" or die "Could not create file rnr.json: $!";

my $prev_dialog_node_id = "null";

my $number = 1;

print RNR "{\n";
foreach(@files) {

	my $file = $_;
	print "Processing ".$file." ...\n";
	my $url = $file;
	$url =~ s/\.md$//;
	
	print $url;
	chomp($url);
	
	local $/ = undef;
	
	open MDFILE, $file or die "Could not open $file: $!";

	binmode MDFILE;
	
	my $document = <MDFILE>;
	
	my $title = $document;
	
	#TODO
	$title = s/title: ([^\r]*).*/\1/;
	
	my $json = JSON->new;

	my $data_to_json = {doc=>{id=>$number,author=>"https://console.bluemix.net/docs/services/conversation/$url.html",title=>"$title",body=>"$document"}};     

	print RNR "\"add\": ";
	print RNR $json->encode($data_to_json);
	print RNR ",\n";

	close MDFILE;
	
	$number++;
}

print RNR "\"commit\" : { }\n}\n";

close RNR;

