import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HighlightCard } from "../../components/HighlightCard";
import { Transaction, TransactionCard } from "../../components/TransactionCard";
import { CollectionKeysEnum } from "../../enums/CollectionKeysEnum";
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransacitonsList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

export interface TransactionListProps extends Transaction {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransactionDate: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TransactionListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const theme = useTheme();

  function getLastTransactionDate(
    trasactions: TransactionListProps[],
    type: "positive" | "negative"
  ) {
    const dateOfTransactions = trasactions
      .filter((transaction) => transaction.type === type)
      .map((transaction) => {
        return new Date(transaction.date).getTime();
      });

    return new Date(Math.max(...dateOfTransactions)).toLocaleDateString(
      "pt-BR",
      {
        month: "long",
        day: "2-digit",
      }
    );
  }

  async function loadTransactions() {
    const data = await AsyncStorage.getItem(CollectionKeysEnum.TRANSACTIONS);

    const transactions: TransactionListProps[] = data ? JSON.parse(data) : [];

    let entriesSum = 0;
    let expensesSum = 0;

    const transactionsFormatted = transactions.map((transaction) => {
      if (transaction.type === "positive") {
        entriesSum += Number(transaction.amount);
      } else {
        expensesSum += Number(transaction.amount);
      }

      return {
        id: transaction.id,
        name: transaction.name,
        type: transaction.type,
        category: transaction.category,
        amount: Number(transaction.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        date: Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(transaction.date)),
      };
    });

    setData(transactionsFormatted);

    const lastTransactionEntryDate = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionExpenseDate = getLastTransactionDate(
      transactions,
      "negative"
    );
    const totalDateInterval = `01 a ${lastTransactionExpenseDate}`;

    setHighlightData({
      entries: {
        amount: entriesSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransactionDate: `Última entrada dia ${lastTransactionEntryDate}`,
      },
      expenses: {
        amount: expensesSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransactionDate: `Última entrada dia ${lastTransactionExpenseDate}`,
      },
      total: {
        amount: (entriesSum - expensesSum).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransactionDate: totalDateInterval,
      },
    });

    setIsLoading(false);
  }

  // useEffect(() => {
  //   console.log("test");
  //   loadTransactions();

  //   // async function removeAll() {
  //   //   await AsyncStorage.removeItem(CollectionKeysEnum.TRANSACTIONS);
  //   // }

  //   // removeAll();
  // }, []);

  // quando volta pra screen
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: "https://avatars.githubusercontent.com/u/60050660?v=4",
                  }}
                />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>Lucas</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransactionDate}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransactionDate}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransactionDate}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransacitonsList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
