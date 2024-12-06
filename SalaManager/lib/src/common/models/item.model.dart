class SampleItem {
  final int id;
  final String name;
  final DateTime date;
  bool isSelected;
  int price;

  SampleItem({
    required this.id,
    required this.name,
    required this.date,
    this.isSelected = false,
    required this.price,
  });
}