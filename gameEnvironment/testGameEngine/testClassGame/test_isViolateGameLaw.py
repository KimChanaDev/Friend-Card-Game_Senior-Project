from GameEnvironment.gameEngine.gameEnvironment import *
import unittest





class test_isViolateGameLaw(unittest.TestCase):
    def test_isViolateGameLaw_should_return_True_if_player_is_first_person_to_play(self):
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
        Player = game.getPlayer(game.getBidWinnerPosition())
        card = Player.getAllCard()[0]
        self.assertTrue(game.isViolateGameLaw(card))
    def test_isViolateGameLaw_should_return_True_if_drop_card_is_trump_card(self):
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
        Player = game.getPlayer(game.getBidWinnerPosition())
        Card = card(game.getTrumpCard,5,4)
        self.assertTrue(game.isViolateGameLaw(Card))

    def test_isViolateGameLaw_should_return_True_if_suite_card_is_the_same_as_first_card_played(self):
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
        Player = game.getPlayer(game.getBidWinnerPosition())
        Card1 = card("Hearts",5,4)
        game.updatePlayedCardEachRound(Card1)
        Card2 = card("Hearts",6,7)
        self.assertTrue(game.isViolateGameLaw(Card2))
        

# Run the tests
if __name__ == '__main__':
    unittest.main()