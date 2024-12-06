import 'models/user_model.dart';

class AuthService {
  User? _currentUser; // Przechowuje informacje o zalogowanym użytkowniku

  // Przykładowe logowanie - tu powinna być prawdziwa logika
  Future<User> login(String email, String password) async {
    // Zakładamy, że po weryfikacji poświadczeń użytkownik się loguje
    _currentUser = User(
      name: 'Admin',
      email: email,
      type: UserType.admin, // lub UserType.user w zależności od roli
    );
    return _currentUser!;
  }

  // Funkcja do uzyskania informacji o zalogowanym użytkowniku
  Future<User?> getUserInfo() async {
    return _currentUser; // Zwraca aktualnie zalogowanego użytkownika
  }

  // Funkcja wylogowania
  Future<void> logout() async {
    _currentUser = null; // Usuwa informacje o użytkowniku
  }
}
