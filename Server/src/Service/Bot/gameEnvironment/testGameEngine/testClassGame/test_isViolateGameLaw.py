from GameEnvironment.gameEngine.gameEnvironment import *
import unittest





class test_isViolateGameLaw(unittest.TestCase):
    def test_isViolateGameLaw_should_return_True_if_player_is_first_person_to_play(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        Player = game.getPlayer(game.getBidWinnerPosition())
        card = Player.getAllCard()[0]
        self.assertTrue(game.isNotViolateGameLaw(card))
    

    def test_isViolateGameLaw_should_return_True_if_suite_card_is_the_same_as_first_card_played(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        Player = game.getPlayer(game.getBidWinnerPosition())
        Card1 = card("Hearts",5,4)
        game.updatePlayedCardEachRound(Card1)
        Card2 = card("Hearts",6,7)
        self.assertTrue(game.isNotViolateGameLaw(Card2))
    def test_isViolateGameLaw_should_return_false_if_suite_card_is_not_the_same_as_first_card_played(self):
        p1 = player("p1",0)
        p2 = player("p2",1)
        p3 = player("p3",2)
        p4 = player("p4",3)
        game = Game(p1,p2,p3,p4)
        game.setGameScore()
        game.provideCard()
        game.determineBidWinner()
        game.setFriendCard()
        game.identifyTeam()
        Player = game.getPlayer(game.getBidWinnerPosition())
        Card1 = card("Hearts",5,4)
        game.updatePlayedCardEachRound(Card1)
        Card2 = card("Spades",6,7)
        self.assertFalse(game.isNotViolateGameLaw(Card2))

# Run the tests
if __name__ == '__main__':
    unittest.main()