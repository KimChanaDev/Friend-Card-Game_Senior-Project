from GameEnvironment.gameEngine.gameEnvironment import *
import unittest





class test_calculateGameScore(unittest.TestCase):
    def test_calculateGaneScore_should_exactly_determine_right_score(self):
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
        score = game.calculateGameScore(Cards)
        self.assertEqual(score,20)
        #------------------------------------------------
        Card1 = card("Queens",'K',10)
        Card2 = card("Queens",10,10)
        Card3 = card("Queens",'A',10)
        Card4 = card("Spades",5,10)
        Cards = [Card1,Card2,Card3,Card4]
        score = game.calculateGameScore(Cards)
        self.assertEqual(score,25)


   

   

# Run the tests
if __name__ == '__main__':
    unittest.main()