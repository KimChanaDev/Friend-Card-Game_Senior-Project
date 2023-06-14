import unittest
import sys
sys.path.append('C:\\Users\\User\\Desktop\\gameEnvironment\\gameEnvironment\\gameEngine')

from gameEnvironment import *


class test_initialCard(unittest.TestCase):
    def test_initialCard_should_have_deck_got_52_distinct_card(self):
        Deck = deck()
        self.assertTrue( len(Deck.getAllcard()) == len(set(Deck.getAllcard())))
        self.assertEqual(len(Deck.getAllcard()),52)
       
        
   

        
       

       

# Run the tests
if __name__ == '__main__':
    unittest.main()