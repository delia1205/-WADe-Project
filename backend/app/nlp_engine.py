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
        detected_lang = detect(text)
        print(f"Detected language: {detected_lang}")

        # Translate to English if necessary
        return self.translator.translate(text, src=detected_lang, dest="en").text if detected_lang != "en" else text

    def process_countries_query(self, text):
        """Extract country names, regions, and relevant entities for query processing."""
        translated_text = self.get_english_text(text)
        doc = self.nlp(translated_text.lower())

        country_keywords = ["capital", "currency", "language", "population", "continent", "region"]
        currency_keywords = ["euro", "dollar", "yen", "rupee"]
        region_keywords = ["europe", "asia", "africa", "north america", "south america", "oceania"]

        extracted_countries = [ent.text for ent in doc.ents if ent.label_ == "GPE"]
        country_codes = [self.get_country_code(country) for country in extracted_countries if self.get_country_code(country)]

        detected_regions = [region for region in region_keywords if region in translated_text.lower()]
        detected_currencies = [word for word in currency_keywords if word in translated_text.lower()]

        print(f"Detected text: {translated_text}")
        print(f"Detected regions: {detected_regions}")

        if country_codes:
            return {"api": "countries", "type": "single" if len(country_codes) == 1 else "multiple", "entities": country_codes}

        if detected_regions: 
            return {"api": "countries", "type": "region", "entities": detected_regions}

        if detected_currencies:
            return {"api": "countries", "type": "currency", "entities": detected_currencies}

        return {"api": "countries", "type": "general", "entities": []} 
    
    def process_spacex_query(self, text):
        """Extract SpaceX-related entities for API query processing."""
        translated_text = self.get_english_text(text)
        doc = self.nlp(translated_text.lower())

        rocket_keywords = ["falcon 9", "falcon heavy", "starship", "dragon"]
        launch_keywords = ["latest launch", "next launch", "past launches", "upcoming launch"]
        mission_keywords = ["crew mission", "cargo mission", "starlink", "demo"]

        detected_rockets = [word for word in rocket_keywords if word in translated_text.lower()]
        detected_launches = [word for word in launch_keywords if word in translated_text.lower()]
        detected_missions = [word for word in mission_keywords if word in translated_text.lower()]

        print(f"Detected text: {translated_text}")
        
        if detected_rockets:
            return {"api": "spacex", "type": "rocket", "entities": detected_rockets}
        if detected_launches:
            return {"api": "spacex", "type": "launch", "entities": detected_launches}
        if detected_missions:
            return {"api": "spacex", "type": "mission", "entities": detected_missions}
        
        return {"api": "spacex", "type": "general", "entities": []}
