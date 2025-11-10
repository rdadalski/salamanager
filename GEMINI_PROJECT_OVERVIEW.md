# Wytyczne Użycia Gemini CLI w Projekcie "SalaManager"

Data utworzenia: 10.09.2025

## 1. Filozofia

Ten dokument określa zasady korzystania z asystenta AI `gemini-cli` w tym projekcie. Naszą nadrzędną filozofią jest traktowanie AI jako **narzędzia wspomagającego (asystenta)**, a nie jako samodzielnego autora kodu. Ostateczna odpowiedzialność za jakość, bezpieczeństwo i zrozumienie kodu zawsze spoczywa na programiście.

## 2. Złote Zasady (Niepodważalne)

1.  ✅ **100% Odpowiedzialności:** Ty jesteś w 100% odpowiedzialny za kod dodany do bazy kodu, niezależnie od tego, czy napisałeś go ręcznie, czy wygenerowałeś przy pomocy AI.
2.  ✅ **Zrozumienie Przed Commitem:** **NIGDY** nie commituj kodu, którego w pełni nie rozumiesz. Jeśli AI wygenerowało rozwiązanie, którego nie potrafisz wyjaśnić linijka po linijce, nie jest ono gotowe do wdrożenia.
3.  ✅ **Review Jak Każdy Inny Kod:** Traktuj kod wygenerowany przez AI tak, jakby był to Pull Request od nowego, niedoświadczonego programisty. Wymaga on pełnego przeglądu, zrozumienia i potencjalnie refaktoryzacji.

## 3. Zalecane Zastosowania (Co ROBIMY z Gemini)

Zachęcamy do używania `gemini-cli` w celu przyspieszenia pracy w następujących obszarach:

* **Boilerplate i Szablony:** Generowanie szkieletów komponentów, plików konfiguracyjnych, podstawowych struktur klas.
* **Testy Jednostkowe:** Pisanie testów dla istniejących, dobrze zdefiniowanych funkcji.
* **Refaktoryzacja:** Propozycje refaktoryzacji małych, izolowanych fragmentów kodu (np. "Zrefaktoryzuj tę funkcję, aby była bardziej czytelna").
* **Dokumentacja:** Generowanie komentarzy JSDoc/TSDoc dla istniejących funkcji.
* **Nauka i Wyjaśnienia:** Zadawanie pytań w stylu "Wyjaśnij mi, jak działa ten fragment kodu" lub "Jaka jest różnica między X a Y?".
* **Proste Funkcje Użytkowe (Utils):** Tworzenie małych, czystych funkcji, np. do formatowania dat, walidacji formularzy itp.

## 4. Zakazane Zastosowania (Czego NIE ROBIMY z Gemini)

Aby uniknąć utraty kontroli nad projektem, kategorycznie zabraniamy używania `gemini-cli` do:

* 🚫 **Projektowania Architektury:** AI nie może podejmować decyzji o strukturze aplikacji, przepływie danych czy wyborze kluczowych bibliotek.
* 🚫 **Pisania Kluczowej Logiki Biznesowej:** Złożone procesy, które stanowią serce aplikacji, muszą być napisane i w pełni zrozumiane przez programistę.
* 🚫 **"Ślepych Commitów":** Generowania kodu i wrzucania go do repozytorium bez dogłębnej analizy i manualnego przetestowania.
* 🚫 **Naprawiania Błędów Bezpieczeństwa:** AI może pomóc zidentyfikować problem, ale łatka bezpieczeństwa musi być wdrożona z pełnym zrozumieniem jej działania.

## 5. Proces Pracy (Nasz Workflow)

Każde użycie `gemini-cli` do generowania kodu powinno przebiegać według następującego schematu:

1.  **Zdefiniuj zadanie:** Dokładnie określ, co chcesz osiągnąć i jaki problem rozwiązać.
2.  **Sformułuj Prompt:** Napisz precyzyjny prompt dla `gemini-cli`, dostarczając mu niezbędny kontekst (np. istniejący kod).
3.  **WYGENERUJ I ZANALIZUJ:** Wygeneruj kod.
4.  **REVIEW I REFAKTORYZACJA:** **To jest najważniejszy krok.** Przeczytaj kod linijka po linijce. Zrozum go. Popraw nazwy zmiennych, dostosuj styl do reszty projektu, upewnij się, że nie ma w nim błędów logicznych. **Prawie nigdy nie używaj kodu 1:1.**
5.  **Testuj:** Napisz lub uruchom testy, aby upewnić się, że kod działa zgodnie z oczekiwaniami i nie psuje niczego innego.
6.  **Commit:** Scommituj kod z jasnym opisem. Możesz opcjonalnie dodać notatkę `(assisted by AI)`, aby zachować transparentność.
