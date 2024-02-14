"use client";
import { useApollo } from "../apollo";
import Board from "../components/Board"
import { ApolloProvider } from "@apollo/client";
export default function Home() {
  
  return (
    <>
    <ApolloProvider client={useApollo()}>
      <Board />
    </ApolloProvider>
    </>
  );
}