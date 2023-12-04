import React, { useState, useEffect, FormEvent } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Stack,
} from '@chakra-ui/react';
import { PasswordField } from './components/PasswordField'; // Suponiendo que PasswordField es exportado correctamente desde './components/PasswordField'

function App() {
    const [nickName, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState('');

    const saveTokenToLocalStorage = (token: string) => {
        localStorage.setItem('authToken', token);
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickName, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }

            const data = await response.json();
            const authToken = data.token;
            setToken(authToken);
            saveTokenToLocalStorage(authToken);
            setError('');
        } catch (error: any) {
            setError(error.message);
            setToken('');
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    return (
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
            <Stack spacing="8">
                <Box
                    py={{ base: '0', sm: '8' }}
                    px={{ base: '4', sm: '10' }}
                    bg={{ base: 'transparent', sm: 'bg.surface' }}
                    boxShadow={{ base: 'none', sm: 'md' }}
                    borderRadius={{ base: 'none', sm: 'xl' }}
                >
                    <form onSubmit={handleLogin}>
                        <Stack spacing="6">
                            <Stack spacing="5">
                                <FormControl>
                                    <FormLabel htmlFor="nickName">Nickname</FormLabel>
                                    <Input
                                        id="nickName"
                                        type="text"
                                        value={nickName}
                                        onChange={e => setNickname(e.target.value)}
                                    />
                                </FormControl>
                                <PasswordField
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Stack>
                            <Stack spacing="6">
                                <Button type="submit">Sign in</Button>
                            </Stack>
                        </Stack>
                    </form>
                    {/* {error && <p>{error}</p>}
                    {token && <p>Token: {token}</p>} */}
                </Box>
            </Stack>
        </Container>
    );
}

export default App;
