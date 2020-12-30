
module.exports = {

		'magic' : {
								'jpg' : 'ffd8ffe0' ,
																			'jpg1' : 'ffd8ffe1' ,
																														'png' : '89504e47' ,
																																									'gif' : '47494638' ,
																																																				'png1' : '89504e470d0a1a0a'
		} ,

		'checkMagic' : (magic) => {
																			var fMagic = module.exports.magic;
																																					if (magic == fMagic.jpg || magic == fMagic.jpg1 || magic == fMagic.png || magic == fMagic.gif || magic == fMagic.png1) {	
																																																																																							
																																										return true;
																																					} else {
																																										return false;
																																					}

		}

}