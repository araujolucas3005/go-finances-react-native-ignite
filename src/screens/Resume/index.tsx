import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { HistoryCard } from "../../components/HistoryCard";
import { CollectionKeysEnum } from "../../enums/CollectionKeysEnum";
import {
  Container,
  Header,
  Title,
  Content,
  CharContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from "./styles";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { TransactionListProps } from "../Dashboard";
import { categories } from "../../utils/categories";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityIndicator } from "react-native";

interface CategoryTotalAmountMapProps {
  [categoryKey: string]: number;
}

interface TotalByCategoryProps {
  key: string;
  categoryName: string;
  total: number;
  totalFormatted: string;
  color: string;
  percentage: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<
    TotalByCategoryProps[]
  >([]);

  const theme = useTheme();

  function handleDateChange(action: "next" | "prev") {
    if (action === "next") {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadData() {
    setIsLoading(true);

    const data = await AsyncStorage.getItem(CollectionKeysEnum.TRANSACTIONS);
    const currentData: TransactionListProps[] = data ? JSON.parse(data) : [];

    const categoryTotalAmountMap: CategoryTotalAmountMapProps = {};

    currentData
      .filter(
        (transaction) =>
          transaction.type === "negative" &&
          new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
          new Date(transaction.date).getFullYear() ===
            selectedDate.getFullYear()
      )
      .forEach((expense) => {
        if (!categoryTotalAmountMap[expense.category]) {
          categoryTotalAmountMap[expense.category] = Number(expense.amount);
        } else {
          categoryTotalAmountMap[expense.category] += Number(expense.amount);
        }
      });

    const totalFromAll = Object.values(categoryTotalAmountMap).reduce(
      (sum, currentAmount) => {
        return sum + currentAmount;
      },
      0
    );

    const totalByCategories = categories
      .filter((category) => categoryTotalAmountMap[category.key])
      .map((category) => {
        const total = categoryTotalAmountMap[category.key];

        return {
          key: category.key,
          categoryName: category.name,
          color: category.color,
          total,
          totalFormatted: total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          percentage: `${((total / totalFromAll) * 100).toFixed(0)}%`,
        };
      });

    setTotalByCategories(totalByCategories);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange("prev")}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, "MMMM, yyyy", {
                locale: ptBR,
              })}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange("next")}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <CharContainer>
            <VictoryPie
              data={totalByCategories}
              x="percentage"
              y="total"
              colorScale={totalByCategories.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
            />
          </CharContainer>

          {totalByCategories.map((category) => (
            <HistoryCard
              key={category.key}
              title={category.categoryName}
              amount={category.totalFormatted}
              color={category.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
