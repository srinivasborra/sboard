package com.myown.test.sboard.sequence;

import org.bson.Document;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class SequenceIdGenerator {
	
	private void createCountersCollection(MongoCollection<Document> countersCollection,String MY_SEQUENCE_NAME) {

	    Document document = new Document();
	    document.append("_id", MY_SEQUENCE_NAME);
	    document.append("seq", 1);
	    countersCollection.insertOne(document);
	}	
	
	public Object getNextSequence(MongoDatabase database, String MY_SEQUENCE_COLLECTION,String MY_SEQUENCE_NAME) {
		MongoCollection<Document> countersCollection = database.getCollection(MY_SEQUENCE_COLLECTION);
//		if (countersCollection.count() == 0) {
//			createCountersCollection(countersCollection,MY_SEQUENCE_NAME);
//		}
	    Document searchQuery = new Document("_id", MY_SEQUENCE_NAME);
	    Document increase = new Document("seq", 1);
	    Document updateQuery = new Document("$inc", increase);
	    Document result = countersCollection.findOneAndUpdate(searchQuery, updateQuery);
	    System.out.println(result.get("seq"));
	    return result.get("seq");
	}
	
}
