import unittest
from GameEnvironment.gameEngine.gameEnvironment import *


class test_initialCard(unittest.TestCase):
    def test_initialCard_should_have_deck_got_52_distinct_card(self):
        Deck = deck()
        self.assertTrue( len(Deck.getAllCard()) == len(set(Deck.getAllCard())))
        self.assertEqual(len(Deck.getAllCard()),52)
       
        
   

        
       

       

# Run the tests
if __name__ == '__main__':
    unittest.main()