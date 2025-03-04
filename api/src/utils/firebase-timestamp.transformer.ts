export class FirebaseTimestampTransformer {
  static toDate(timestamp: FirebaseFirestore.Timestamp): Date {
    return timestamp ? timestamp.toDate() : null;
  }

  static fromDate(date: Date): FirebaseFirestore.Timestamp {
    return date ? FirebaseFirestore.Timestamp.fromDate(date) : null;
  }
}
