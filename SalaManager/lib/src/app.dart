import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'sample_feature/sample_item_details_view.dart';
import 'sample_feature/home_page.dart';
import 'sample_feature/sample_item_list_view.dart';
import 'settings/settings_controller.dart';
import 'settings/settings_view.dart';

/// The Widget that configures your application.
class MyApp extends StatelessWidget {
  const MyApp({
    super.key,
    required this.settingsController,
    this.initialRoute,
  });

  final SettingsController settingsController;

  /// Dodano właściwość initialRoute, aby umożliwić ustawienie domyślnego route.
  final String? initialRoute;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: settingsController,
      builder: (BuildContext context, Widget? child) {
        return MaterialApp(
          restorationScopeId: 'app',
          debugShowCheckedModeBanner: false,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: const [
            Locale('en', ''), // English, no country code
          ],

          onGenerateTitle: (BuildContext context) =>
          AppLocalizations.of(context)!.appTitle,

          theme: ThemeData(),
          darkTheme: ThemeData.dark(),
          themeMode: settingsController.themeMode,

          /// Ustawienie domyślnego route poprzez initialRoute.
          initialRoute: initialRoute ?? '/',

          /// Możesz również zdefiniować mapę routes, jeśli nie używasz onGenerateRoute.
          // routes: {
          //   '/': (context) => const SampleItemListView(),
          //   SettingsView.routeName: (context) => SettingsView(controller: settingsController),
          //   SampleItemDetailsView.routeName: (context) => const SampleItemDetailsView(),
          //   HomePage.routeName: (context) => const HomePage(),
          // },

          onGenerateRoute: (RouteSettings routeSettings) {
            return MaterialPageRoute<void>(
              settings: routeSettings,
              builder: (BuildContext context) {
                switch (routeSettings.name) {
                  case SettingsView.routeName:
                    return SettingsView(controller: settingsController);
                  case SampleItemDetailsView.routeName:
                    return const SampleItemDetailsView();
                  case HomePage.routeName:
                    return const HomePage();
                /// Ustawienie domyślnego widoku w przypadku nieznanej ścieżki.
                  default:
                    return const SampleItemListView();
                }
              },
            );
          },
        );
      },
    );
  }
}
