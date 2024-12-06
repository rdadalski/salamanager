import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  static const routeName = '/home-page'; // Dodajemy routeName dla nawigacji

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool isLoading = true; // Zmienna kontrolująca stan ładowania

  @override
  void initState() {
    super.initState();
    _loadData(); // Symulacja ładowania danych
  }

  // Funkcja symulująca ładowanie danych z opóźnieniem
  Future<void> _loadData() async {
    // Symulacja pobierania danych (np. z serwera)
    await Future.delayed(Duration(seconds: 1));
    setState(() {
      isLoading = false; // Zakończenie ładowania, ukrycie spinnera
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Text('Dodaj trening'),
          ],
        ),
        centerTitle: true, // Centrowanie tytułu i ikony
      ),
      body: Center(
        child: isLoading
            ? CircularProgressIndicator() // Wyświetl spinner, jeśli dane się ładują
            : SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Dane zostały załadowane!'),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/sample_item'); // Nawigacja po załadowaniu danych
                },
                child: Text('Przejdź do szczegółów treningu'),
              ),
              SizedBox(height: 20),
              Text('Przykłady różnych widgetów:'),
              SizedBox(height: 20),

              // Przykład TextField
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: TextField(
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Wprowadź nazwę treningu',
                  ),
                ),
              ),
              SizedBox(height: 20),

              // Przykład Image
              Image.network(
                'https://via.placeholder.com/150',
                height: 150,
                width: 150,
              ),
              SizedBox(height: 20),

              // Przykład Icon
              Icon(Icons.fitness_center, size: 50, color: Colors.blue),
              SizedBox(height: 20),

              // Przykład ListView wewnątrz SingleChildScrollView
              Container(
                height: 200,
                child: ListView(
                  children: List.generate(
                    5,
                        (index) => ListTile(
                      leading: Icon(Icons.check),
                      title: Text('Element Listy $index'),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
