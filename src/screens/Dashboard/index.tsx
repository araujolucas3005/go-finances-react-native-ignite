import React from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { Transaction, TransactionCard } from "../../components/TransactionCard";
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
} from "./styles";

export interface TransactionListProps extends Transaction {
  id: string;
}

export function Dashboard() {
  const data: TransactionListProps[] = [
    {
      id: "1",
      type: "positive",
      title: "Desenvolvimento de site",
      amount: "R$ 12.000,00",
      date: "13/04/2022",
      category: {
        name: "Vendas",
        icon: "dollar-sign",
      },
    },
    {
      id: "2",
      type: "negative",
      title: "Desenvolvimento de site",
      amount: "R$ 12.000,00",
      date: "13/04/2022",
      category: {
        name: "Vendas",
        icon: "coffee",
      },
    },
    {
      id: "3",
      type: "negative",
      title: "Desenvolvimento de site",
      amount: "R$ 12.000,00",
      date: "13/04/2022",
      category: {
        name: "Vendas",
        icon: "shopping-bag",
      },
    },
  ];

  return (
    <Container>
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
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
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
    </Container>
  );
}
