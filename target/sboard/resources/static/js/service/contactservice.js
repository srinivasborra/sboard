app.service('ContactService',function(){
	var uid=0;
	var contacts=[];
	console.log("Contact Service");
//	this.save=function(contact){
//		if(contact.id==null){
//			contact.id=uid++;
//			contacts.push(contact);
//		}else{
//			for(i in contacts){
//				if(contacts[i].id==contact.id){
//					contacts[i]=contact;
//				}
//			}
//		}
//	};
//	this.list=function(){
//		return contacts;
//	};
//	
//	this.get=function(id){
//		for(i in contacts){
//			if(contacts[i].id==id){
//				return contacts[i];
//			}
//		}
//		
//	};
//	this.deleteContact=function(id){
//		for(i in contacts){
//			if(contacts[i].id==id){
//				contacts.splice(i,1);
//			}else{
//				console.log("there is no contact");
//			}
//		}
//	}
});