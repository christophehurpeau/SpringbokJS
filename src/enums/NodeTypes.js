/**
 * Enum for node type codes. https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
 * @enum {number}
 */
var NodeTypes={
	ELEMENT: 1,
	ATTRIBUTE: 2, //Deprecated
	TEXT: 3,
	CDATA_SECTION: 4, //Deprecated
	ENTITY_REFERENCE: 5, //Deprecated
	ENTITY: 6, //Deprecated
	PROCESSING_INSTRUCTION: 7,
	COMMENT: 8,
	DOCUMENT: 9,
	DOCUMENT_TYPE: 10,
	DOCUMENT_FRAGMENT: 11,
	NOTATION: 12 //Deprecated
};