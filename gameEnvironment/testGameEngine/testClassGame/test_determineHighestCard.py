from GameEnvironment.gameEngine.gameEnvironment import *
import unittest





class test_determineHighestCard(unittest.TestCase):
    def test_determineHighestCard_should_return_the_correct_index_if_there_is_no_trump_in_round(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.setTrumpCard("Clubs")
        Card1 = card("Queens",5,10)
        Card2 = card("Queens",10,10)
        Card3 = card("Queens",'A',10)
        Card4 = card("Spades",5,10)
        Cards = [Card1,Card2,Card3,Card4]
        index = game.determineHighestCard(Cards)
        self.assertEqual(index,2)

   

   

# Run the tests
if __name__ == '__main__':
    unittest.main()