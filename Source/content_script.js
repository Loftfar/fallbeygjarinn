$.noConflict();

walk(document.body);

document.addEventListener("DOMNodeInserted", function(e) {
	console.log( "Node inserted" );
	walk( e.target );
}, false);

function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode) 
{
	var textNodeValue = textNode.nodeValue;
	var modifierString = "(þgf.)";
	/*
	var regex=/(þf|þgf|ef(\.)?)/;
	var modifierString = regex.exec( textNodeValue );
	console.log("found: " + modifierString);
	*/
	var indexOfModifier = textNodeValue.indexOf( modifierString );

	if( indexOfModifier > -1 ) {
		console.log( "Found an instance!" );
		var nameNode = textNode.previousSibling.firstChild;
		var oldNameString = nameNode.nodeValue;
		
		var parameters = JSON.stringify( {string:oldNameString,modifier:modifierString} );
		console.log( "Invoking service with parameters: " + parameters);
		jQuery.post( "http://www.smu.is/Apps/WebObjects/Smu.woa/wa/InflectionController/lookup", parameters, function( data ) {
			var result = jQuery.parseJSON( data );
    	    console.log( "Received result: " + result );
    	    nameNode.nodeValue = result.result;		
			textNodeValue = textNodeValue.replace( modifierString, "");
			textNode.nodeValue = textNodeValue;
		});
	}
}