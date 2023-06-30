import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import os
import numpy as np

class Linear_QNet(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.linear1 = nn.Linear(input_size, hidden_size)
        self.linear2 = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = F.relu(self.linear1(x))
        x = self.linear2(x)
        return x

    def save(self, file_name='model.pth'):
        model_folder_path = './model'
        if not os.path.exists(model_folder_path):
            os.makedirs(model_folder_path)

        file_name = os.path.join(model_folder_path, file_name)
        torch.save(self.state_dict(), file_name)


class QTrainer:
    def __init__(self, model, lr, gamma):
        self.lr = lr
        self.gamma = gamma
        self.model = model
        self.optimizer = optim.Adam(model.parameters(), lr=self.lr)
        self.criterion = nn.MSELoss()

    def train_step(self, state, action, reward, next_state, done):
        state = np.array(state)
        next_state = np.array(next_state)
        action = np.array(action)
        reward = np.array(reward)


        state = torch.tensor(state, dtype=torch.float)
        next_state = torch.tensor(next_state, dtype=torch.float)
        action = torch.tensor(action, dtype=torch.float)
        reward = torch.tensor(reward, dtype=torch.float)
        # (n, x)

        if len(state.shape) == 1:
            # (1, x)
            state = torch.unsqueeze(state, 0)
            next_state = torch.unsqueeze(next_state, 0)
            action = torch.unsqueeze(action, 0)
            reward = torch.unsqueeze(reward, 0)
            done = (done, )

        # 1: predicted Q values with current state
        pred = self.model(state)

        target = pred.clone()
        for idx in range(len(done)):
            # print(target[idx],'all state')
            # print(torch.argmax(action[idx]),'action',reward[idx],'reward\n')
            Q_old =  target[idx][torch.argmax(action[idx]).item()]
            # print(Q_old,'Q_old')
            Q_new = reward[idx]
            
            if not done[idx]:
                k = 1
                while True:
                    
                    top_values, top_indices = torch.topk(self.model(next_state[idx]), k=k)
                    if self.notViolateRule(next_state[idx],top_indices[k-1].item()):
                         Q_new = reward[idx] + self.gamma * top_values[k-1].item()
                         break
                    else:
                        k+=1
                        # print(k)
            # print(Q_new,'Q_new\n')
            target[idx][torch.argmax(action[idx]).item()] = Q_new
    
        # 2: Q_new = r + y * max(next_predicted Q value) -> only do this if not done
        # pred.clone()
        # preds[argmax(action)] = Q_new
        self.optimizer.zero_grad()
        loss = self.criterion(target, pred)
        loss.backward()
        self.optimizer.step()
    def notViolateRule(self,state_tensor,action):
        state_array = state_tensor.numpy()
        cardInhand = state_array[0:52]
        leadingSuite = state_array[52:56]
        trumpSuite = state_array[56:60]
        self.isCardInhand(cardInhand,action)
        # check if card is in hand
        if not self.isCardInhand(cardInhand,action):
            return False
        # check if it is a leading card otherwise check if card follow leading card
        if self.isLeadingAction(leadingSuite):
            return True
        if self.isFollowLeading(leadingSuite,action):
            return True
        # check if card is a trump
        # if self.isTrumpcard(trumpSuite,action):
        #     return True
        # check if void card
        if self.isVoidCard(cardInhand,leadingSuite):
            return True
        return False
    def isCardInhand(self,cards,action):
        # print(action)
        row_index = int(action / 7)
      #  print(row_index)
        for i in range(13):
            if (cards[(row_index*13)+i]==1):
                return True
        return False
    def isTrumpcard(self,trump,action):
        row_index = int(action / 7)
        if trump[row_index]==1:
            return True
        return False
    def isVoidCard(self,cards,leadingSuite):
    
        leadingSuiteIndex = np.where(leadingSuite == 1)
        leadingSuiteIndex = leadingSuiteIndex[0][0]
        # print(leadingSuiteIndex)
        for i in range(13):
            if cards[leadingSuiteIndex*13+i]==1:
                return False
        return True
    
    def isFollowLeading(self,leadingSuite,action):
        row_index = int(action / 7)
        if leadingSuite[row_index]==1:
            return True
        return False
    def isLeadingAction(self,leadingSuite):
        if all(suite == 0 for suite in leadingSuite):
            return True
        return False

