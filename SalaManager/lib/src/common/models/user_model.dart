enum UserType {
  admin,
  user,
}

class User {
  final String name;
  final String email;
  final UserType type;

  User({
    required this.name,
    required this.email,
    required this.type,
  });
}