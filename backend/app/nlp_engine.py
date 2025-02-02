import spacy
import pycountry
from langdetect import detect
from googletrans import Translator

class NLPProcessor:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.translator = Translator()
    
    def get_country_code(self, country_name):
        """Convert country name to ISO country code (e.g., 'France' -> 'FR')."""
        try:
            return pycountry.countries.lookup(country_name).alpha_2
        except LookupError:
            return None  # Return None if no country is found
    
    def get_english_text(self, text):
        """Detect query language, translate to English if needed, and process it."""
        user_input = text

        #  Detect the language of the input
        detected_lang = detect(user_input)
        print(f"Detected language: {detected_lang}")

        #  Translate to English if not already in English
        if detected_lang != "en":
            translated_text = self.translator.translate(user_input, src=detected_lang, dest="en").text
        else:
            translated_text = user_input

        return translated_text

    def process_query(self, text):
        """Extract country names or anime titles and return API type & relevant entities."""
        translated_text = self.get_english_text(text)
        # doc = self.nlp(text.lower())
        doc = self.nlp(translated_text.lower())

        country_keywords = ["capital", "currency", "language", "population"]

        extracted_countries = [ent.text for ent in doc.ents if ent.label_ == "GPE"]  # Detect countries

        # Convert country names to country codes
        country_codes = [self.get_country_code(country) for country in extracted_countries]
        country_codes = [code for code in country_codes if code]  # Remove None values

        # Determine if the question is about a country or anime
        if any(word in text.lower() for word in country_keywords) and country_codes:
            return {"api": "countries", "type": "country", "entities": country_codes}

        return {"api": "countries", "type": "general", "entities": country_codes}  # Default to Countries API

