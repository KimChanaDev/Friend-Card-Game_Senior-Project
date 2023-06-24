ction).item()
            card_to_play[action] = 1

        return card_to_play
    def get_reward(self,game):
        return game.getReward()

def train():
    plot_scores = []