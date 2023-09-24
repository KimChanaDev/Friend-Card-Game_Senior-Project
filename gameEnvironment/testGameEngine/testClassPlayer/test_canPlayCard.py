import unittest


from GameEnvironment.gameEngine.gameEnvironment import *




class test_canPlayCard(unittest.TestCase):
    def test_canPlayCard_should_return_true_if_card_was_drop_is_in_player_hand(self):
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
        availableCard = game.getPlayer(0).getAllCard()
        playedCard = availableCard[0]
        self.assertTrue(game.getPlayer(0).canPlayCard(playedCard))
    def test_canPlayCard_should_return_false_if_card_is_not_in_player_hand(self):
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
        Deck =  deck()
        unAvailableCard =  set(Deck.getAllCard()) - set(game.getPlayer(0).getAllCard() ) 
        playedCard = list(unAvailableCard)[0]
        self.assertFalse(game.getPlayer(0).canPlayCard(playedCard))
    def test_playCard_should_return_false_if_card_is_never_exist_in_deck(self):
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
        playedCard =  card('Q',100,100 )
        self.assertFalse(game.getPlayer(0).canPlayCard(playedCard))

# Run the tests
if __name__ == '__main__':
    unittest.main()
