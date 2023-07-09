while not game.isEndGame():
        if game.getTurnPlayerIndex()==0 :
            state_old,done = agent.get_state(game)
            n_largest = 0
            output = agent.get_best_action(state_old,n_largest)
            while not playCard(game,output):
                n_largest+=1
                output = agent.get_best_action(state_old,n_largest)
                error = True
                
            # if error==True:
            #     count+=1
            #     print(count)
            #     error = False
        else:
            state_old,done = oldAgent.get_state(game)
            n_largest = 0
            output = oldAgent.get_best_action(state_old,n_largest)
            while not playCard(game,output):
                n_largest+=1
                output = oldAgent.get_best_action(state_old,n_largest)
                error = True