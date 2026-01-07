var SFConfigurataor = {
	endpoint : "",
	authorization_token : "",

	GetCallUrl : function(url_suffix) {
		return SFConfigurataor.endpoint + url_suffix;
	},
	ExtarctAllObjectName : _ExtarctAllObjectName,
	GetAllObjectsName : _GetAllObjectsName,
	GetMetadataOfObject : _GetMetadataOfObject,

	all_ai_data : []
};

function _ExtarctAllObjectName(objects_data) {
	var _returned_array = new Array();
	for (var o_a = 0; o_a < objects_data.length; o_a++) {
		var _sobject = new Object();
		var object_data = objects_data[o_a];
		_sobject["Label"] = object_data["label"];
		_sobject["ObjectName"] = object_data["sobjectName"];
		_returned_array.push(_sobject);
	}
	return _returned_array;
}

function _GetAllObjectsName() {
	_GetApexTriggerOfObject("Account");
	$.ajax({
		url : SFConfigurataor.GetCallUrl("/services/data/v43.0/tabs"),
		type : "Get",
		headers : {
			"Authorization" : "Bearer " + SFConfigurataor.authorization_token
		},
		success : function(objects_data) {
			var _returned_objects = SFConfigurataor
					.ExtarctAllObjectName(objects_data);
			SFConfigurataor.GetMetadataOfObject("Account")
		},
		error : function(error_data) {

		}
	})
}

function _GetMetadataOfObject(object_name) {
	$.ajax({
		url : SFConfigurataor.GetCallUrl("/services/data/v43.0/sobjects/")
				+ object_name + "/describe",
		type : "Get",
		headers : {
			"Authorization" : "Bearer " + SFConfigurataor.authorization_token
		},
		success : function(returned_data) {
			_AnalyzeAi(returned_data);
		},
		error : function(error_data) {

		}
	});

	console.log(JSON.stringify(SFConfigurataor.all_ai_data));
}

function AiSuggestedKeyword(in_type) {
	if (in_type == null) {
		return "SF_Click";
	}

	if (in_type == "string" || in_type == "double" || in_type == "int") {
		return "SF_TypeTextInEditBox";
	}

	if (in_type == "boolean") {
		return "SF_SelectCheckBox";
	}

	if (in_type.indexOf("textarea") > -1) {
		return "SF_TypeTextInTextArea";
	} else if (in_type.indexOf("text") > -1) {
		return "SF_TypeTextInEditBox";
	} else if (in_type.indexOf("picklist") > -1) {
		return "SF_SelectDataFromPicklist";
	} else {
		return "SF_Click"
	}
}
function _AnalyzeAi(metadta_object) {
	var _fields = metadta_object["fields"]
	for (var _f_i = 0; _f_i < _fields.length; _f_i++) {
		var _field = _fields[_f_i];
		var _compoundObject = new Object();
		_compoundObject["Keyword"] = AiSuggestedKeyword(_field.type);
		_compoundObject["Label"] = _field.label;
		_compoundObject["FieldType"] = _field.type;
		_compoundObject["FieldName"] = _field.name;
		_compoundObject["picklistValues"] = _field.picklistValues;
		_compoundObject["IsCustom"] = _field.custom;
		SFConfigurataor.all_ai_data.push(_compoundObject);
	}

}

function _GetApexTriggerOfObject(object_name) {
	$
			.ajax({
				url : SFConfigurataor
						.GetCallUrl("/services/data/v43.0/tooling/query?q=SELECT Name,Body FROM ApexTrigger where TableEnumOrId='"
								+ object_name + "'"),
				type : "Get",
				contentType : "application/json",
				headers : {
					"Authorization" : "Bearer "
							+ SFConfigurataor.authorization_token
				},
				success : function(returned_data) {
					console.log("Apex Trigger Data "
							+ JSON.stringify(returned_data));
				},
				error : function(error_data) {

				}
			})
}