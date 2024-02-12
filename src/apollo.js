import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { useMemo } from "react";


function createApolloClient(){
    return new ApolloClient({
        link: new HttpLink({uri:"/api/graphql"}),
        cache: new InMemoryCache({
            typePolicies:{
                Card:{
                    keyFields:["id"]
                },
                Column:{
                    keyFields:["id"]
                }
            }
        }),
        defaultOptions:{
            watchQuery:{
                fetchPolicy: "network-only"
            }
        }
    })
}

export function useApollo(){
    const client = useMemo(() => createApolloClient(),[])
    return client
}