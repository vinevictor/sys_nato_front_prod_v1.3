'use client';
import UserFiltroContext from "@/hook/userFilterContext";
import { SelectFilterConstrutora } from "@/implementes/cardCreateUpdate/dropdow/selectFilterConstrutora";
import { SelectFilterFinanceira } from "@/implementes/cardCreateUpdate/dropdow/selectFilterFinanceira";
import { InputGroup, InputLeftAddon, Input, Button, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { MdOutlinePersonSearch } from "react-icons/md";

export default function FiltroUser() {
    const { setId, setNome, setConstrutora, setFinanceira } = UserFiltroContext();

    const [localId, setLocalId] = useState('');
    const [localNome, setLocalNome] = useState('');
    const [localConstrutora, setLocalConstrutora] = useState<number | any>();
    const[localFinanceira, setLocalFinanceira] = useState<number | any>();
    

    const handleFilter = () => {
        setId(Number(localId));
        setNome(localNome); 
        setConstrutora(localConstrutora);
        setFinanceira(localFinanceira);
    };

    return (
        <>
            <Flex>
                <InputGroup>
                    <InputLeftAddon bg={'gray.300'}>ID</InputLeftAddon>
                    <Input 
                        placeholder="ID" 
                        focusBorderColor="lime" 
                        mr={2} 
                        w={'5%'} 
                        name="id" 
                        value={localId}  
                        onChange={(e) => setLocalId(e.target.value)} 
                    />
                    
                    <InputLeftAddon bg={'gray.300'}>Nome</InputLeftAddon>
                    <Input 
                        placeholder="Nome do Usuário" 
                        focusBorderColor="lime" 
                        mr={2} 
                        w={'20%'} 
                        name="nome" 
                        value={localNome} 
                        onChange={(e) => setLocalNome(e.target.value)}  
                    />
                    

                    <SelectFilterConstrutora setLocalConstrutora={setLocalConstrutora}/>
                    <SelectFilterFinanceira setLocalFinanceira={setLocalFinanceira} />

                    <Button colorScheme="blue" onClick={handleFilter}>
                        <MdOutlinePersonSearch />Filtrar
                    </Button>
                </InputGroup>
            </Flex>
        </>
    );
}
