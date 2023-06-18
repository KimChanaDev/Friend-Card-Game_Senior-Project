from GameEnvironment.gameEngine.gameEnvironment import *
import unittest





class test_processPlayerAction(unittest.TestCase):
    def test_proCessPlayerAction_should_not_throw_exception_there_is_one_card_played(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        Card1 = game.getPlayer(0).getAllCard()[0]
    
        error = 1
        game.processPlayerAction(0)
        error = 0
        self.assertEqual(error,0)
    def test_proCessPlayerAction_should_not_throw_exception_there_are_more_than_one_cards_played(self):
        p1 = player("p1")
        p2 = player("p2")
        p3 = player("p3")
        p4 = player("p4")
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        #------------------------------------
        Card1 = game.getPlayer(0).getAllCard()[0]
       
        game.processPlayerAction(0)
        game.updatePlayedCardEachRound(Card1)
        game.updateCardInPlayerHand(0,Card1)
        #----------------------------------------
        Card2 = game.getPlayer(1).getAllCard()[0]
    
        game.processPlayerAction(1)
        game.updatePlayedCardEachRound(Card2)  
        game.updateCardInPlayerHand(1,Card2)  
        error = 0
        self.assertEqual(error,0)

        
 

   

# Run the tests
if __name__ == '__main__':
    unittest.main()