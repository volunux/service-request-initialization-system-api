const User = require('./user');

const Level = require('./level');

const Department = require('./department');

const Faculty = require('./faculty');

const Unit = require('./unit');

const Upload = require('./upload');

const Letter = require('./letter')('Refund' , 'refund');

const Country = require('./country');

const RequestType = require('./request-type');

const RequestLimit = require('./request-limit');

const RequestCredential = require('./request-credential')('RequestCredential' , 'requestcredentials');


const CourseRegistrationComment = require('../models/conversation/timeline')('Request' , 'Course Registration' , 'request' , true); 

const CourseRegistrationReply = require('../models/conversation/reply')('Request' , 'Course Registration' , 'request' , true); 

const GeneralRequest = require('../models/general-request')('Request' , 'request');


const SchoolResultComment = require('../models/conversation/timeline')('Request' , 'School Resul' , 'request' , false); 

const SchoolResultReply = require('../models/conversation/reply')('Request' , 'School Resul' , 'request' , false); 


const InternetCredentialComment = require('../models/conversation/timeline')('Request' , 'Internet Credential' , 'request' , false); 

const InternetCredentialReply = require('../models/conversation/reply')('Request' , 'Internet Credential' , 'request' , false); 


const InternetPasswordComment = require('../models/conversation/timeline')('Request' , 'Internet Password' , 'request' , false);

const InternetPasswordReply = require('../models/conversation/reply')('Request' , 'Internet Password' , 'request' , false); 


const EmailPasswordComment = require('../models/conversation/timeline')('Request' , 'Email Password' , 'request' , false); 

const EmailPasswordReply = require('../models/conversation/reply')('Request' , 'Email Password' , 'request' , false); 


const RefundStage = require('./stage')('Refund' , 'refund');

const RefundComment = require('../models/conversation/timeline')('Refund' , 'Refund' , 'refund' , true); 

const RefundReply = require('../models/conversation/reply')('Refund' , 'Refund' , 'refund' , true); 

const Refund = require('../models/refund');

const Payment = require('../models/payment')('Payment' , 'payments');

const Thesis = require('../models/thesis');

const ThesisComment = require('../models/conversation/timeline')('Thesis' , 'Thesis' , 'thesis' , true); 

const ThesisReply = require('../models/conversation/reply')('Thesis' , 'Thesis' , 'thesis' , true); 

module.exports = {

	'User' : User ,

	'Level' : Level ,
	
	'Department' : Department ,

	'Faculty' : Faculty ,

	'Unit' : Unit ,

	'Upload' : Upload ,

	'Letter' : Letter ,

	'RequestType' : RequestType ,

	'RequestLimit' : RequestLimit ,

	'RequestCredential' : RequestCredential ,

	'GeneralRequest' : GeneralRequest ,

	'GeneralRequestComment' : CourseRegistrationComment ,

	'GeneralRequestReply' : CourseRegistrationReply ,

	'CourseRegistrationComment' : CourseRegistrationComment ,

	'CourseRegistrationReply' : CourseRegistrationReply ,

	'CourseRegistration' : GeneralRequest ,

	'Country' : Country ,

	'RefundStage' : RefundStage ,

	'Refund' : Refund ,

	'RefundComment' : RefundComment ,

	'RefundReply' : RefundReply ,

	'InternetCredential' : GeneralRequest ,

	'InternetCredentialComment' : InternetCredentialComment ,

	'InternetCredentialReply' : InternetCredentialReply ,

	'InternetPassword' : GeneralRequest ,

	'InternetPasswordComment' : InternetPasswordComment ,

	'InternetPasswordReply' : InternetPasswordReply ,

	'EmailPassword' : GeneralRequest ,

	'EmailPasswordComment' : EmailPasswordComment ,

	'EmailPasswordReply' : EmailPasswordReply ,

	'SchoolResult' : GeneralRequest ,

	'SchoolResultComment' : SchoolResultComment ,

	'SchoolResultReply' : SchoolResultReply ,

	'Payment' : Payment ,

	'Thesis' : Thesis

}