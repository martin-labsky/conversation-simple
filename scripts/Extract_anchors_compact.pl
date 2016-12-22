#!/usr/bin/perl

##
# Generate intents and meta dialog node for anchors from *.html.md documenation files
#
# author: Jan Curin <jan_curin@cz.ibm.com>
##

use strict;

## beginning of main

my @files = `ls -1 *.md`;

open INTENTS, ">intents_compact.json" or die "Could not create file intents.json: $!";
open DIALOG, ">dialog_compact.json" or die "Could not create file dialog.json: $!";

my $prev_dialog_node_id = "null";

print DIALOG "{ \"go_to\": null, \"output\": {".
			"\"text\": {".
			"\"values\": [\"See related documentation page for <? current_node.metadata.mapping[intents.intent].text ?> ...\",".
			"\"Found related page for <? current_node.metadata.mapping[intents.intent].text ?> ...\",".
			"\"We do have documentation for <? current_node.metadata.mapping[intents.intent].text ?> ...\"],".
			"\"selection_policy\": \"random\"".
			"},	\"url\": \"<? current_node.metadata.mapping[intents.intent].url ?>\" },".
			"\"parent\": null,".
			"\"metadata\": {".
			"\"mapping\": {\n";

my $ex_no = 0;

foreach(@files) {

	my $file = $_;
	print "Processing ".$file." ...\n";
	my $url = $file;
	$url =~ s/\.md$//;
	
	print $url;
	chomp($url);
	
	open MDFILE, $file or die "Could not open $file: $!";


	my $lineNo;
	my $prevLine = "";

	while( <MDFILE> )  {   

		$lineNo++;

		chomp();

		my $input = $_;

		$input =~ s/\r//g;
		
		if	(m/^-------/) {
				$ex_no++;
				my $anchor = lc($prevLine);
				$anchor =~ s/ /-/g;
				$anchor =~ s/,//g;
				my $anchor_id = $anchor;
				$anchor_id =~ s/@//g;
				$anchor_id =~ s/^sys/_sys/g;
				$anchor_id = "zZz_".$anchor_id;
				
				my $dialog_node_id = $anchor_id;
				print "** ".$prevLine." ... ".$url."#".$anchor."\n";
				print INTENTS "{ \"intent\": \"".$anchor_id."\", \"examples\": [{ \"text\": \"".$prevLine."\" }] },\n";
				if ($ex_no > 1) {
					print DIALOG ",\n";
				}
				print DIALOG " \"".$anchor_id."\": { \"url\": \"http://www.ibm.com/watson/developercloud/doc/conversation/".$url."#".$anchor."\", \"text\": \"".$prevLine."\" }";
				$prev_dialog_node_id = "\"".$dialog_node_id."\"";
		}

		$prevLine = $input;

	}
	
	close MDFILE;
}
print DIALOG "\n}	},".
		"\"conditions\": \"intents && intents.intent.contains('zZz_') && intents.confidence > 0.2\",".
		"\"dialog_node\": \"anchors\",".
		"\"previous_sibling\": \"conversation concepts\"".
		"},\n";

close DIALOG;
close INTENTS;
