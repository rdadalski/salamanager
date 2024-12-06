import 'package:flutter/material.dart';

import '../settings/settings_view.dart';
import 'sample_item.dart';
import 'sample_item_details_view.dart';
import '../common/models/item.model.dart';

/// Displays a list of SampleItems with icon, name, date, and checkbox.
class SampleItemListView extends StatefulWidget {
  const SampleItemListView({
    super.key,
    this.items,
  });

  static const routeName = '/';

  final List<SampleItem>? items;

  @override
  _SampleItemListViewState createState() => _SampleItemListViewState();
}

class _SampleItemListViewState extends State<SampleItemListView> {
  late List<SampleItem> items;

  @override
  void initState() {
    super.initState();
    items = widget.items ?? [
      SampleItem(id: 1, price: 50, name: 'Słupno', date: DateTime.now().subtract(Duration(days: 0)), isSelected: false),
      SampleItem(id: 2, price: 50, name: 'Słupno', date: DateTime.now().subtract(Duration(days: 1)), isSelected: false),
      SampleItem(id: 3, price: 50, name: 'Słupno', date: DateTime.now().subtract(Duration(days: 2)), isSelected: false),
      SampleItem(id: 4, price: 70, name: 'Boks', date: DateTime.now().subtract(Duration(days: 3)), isSelected: false),
      SampleItem(id: 5, price: 70, name: 'Siłowy', date: DateTime.now().subtract(Duration(days: 4)), isSelected: false),
      SampleItem(id: 6, price: 70, name: 'Siłowy', date: DateTime.now().subtract(Duration(days: 5)), isSelected: false),
      SampleItem(id: 7, price: 80, name: 'Boks + Ignacy', date: DateTime.now().subtract(Duration(days: 6)), isSelected: false),
      SampleItem(id: 8, price: 80, name: 'Boks + Ignacy', date: DateTime.now().subtract(Duration(days: 7)), isSelected: false),
      SampleItem(id: 9, price: 80, name: 'Boks + Ignacy', date: DateTime.now().subtract(Duration(days: 8)), isSelected: false),
    ];
  }

  int getTotalPrice() {
    return items.fold(0, (total, item) => total + item.price);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/images/img.png',
              fit: BoxFit.contain,
              height: 32,
            ),
            SizedBox(width: 10),
            const Text('Twoje treningi')
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.restorablePushNamed(context, SettingsView.routeName);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Saldo: -${getTotalPrice()} zł',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: ListView.builder(
              restorationId: 'sampleItemListView',
              itemCount: items.length,
              itemBuilder: (BuildContext context, int index) {
                final item = items[index];

                return ListTile(
                  leading: const CircleAvatar(
                    foregroundImage: AssetImage('assets/images/img.png'),
                  ),
                  title: Text(item.name),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.date.toLocal().toString().split(' ')[0]),
                      Text(
                        item.price.toString() + ' zł',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  trailing: Checkbox(
                    value: item.isSelected,
                    onChanged: (bool? value) {
                      setState(() {
                        item.isSelected = value ?? false;
                      });
                    },
                  ),
                  onTap: () {
                    Navigator.restorablePushNamed(
                      context,
                      SampleItemDetailsView.routeName,
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.pushNamed(context, '/home-page');
        },
        icon: const Icon(Icons.add),
        label: const Text('Dodaj trening'),
      ),
    );
  }
}
