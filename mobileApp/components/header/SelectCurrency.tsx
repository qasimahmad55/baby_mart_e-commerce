import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { useCurrencyStore } from '../../lib/store';
import { ChevronDown } from 'lucide-react-native';

export default function SelectCurrency() {
    const { selectedCurrency, currencies, setCurrency } = useCurrencyStore();
    const [modalVisible, setModalVisible] = useState(false);

    const currentCurrency = currencies.find(c => c.code === selectedCurrency);

    return (
        <View>
            <Pressable
                onPress={() => setModalVisible(true)}
                className="flex-row items-center bg-babyshopPurple/80 rounded-full px-3 py-1.5"
            >
                <Text className="text-white text-xs font-semibold mr-1">
                    {currentCurrency?.symbol} {selectedCurrency}
                </Text>
                <ChevronDown size={12} color="#fff" />
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setModalVisible(false)}
                >
                    <View className="bg-white rounded-t-2xl max-h-[60%]">
                        <View className="px-5 pt-5 pb-3 border-b border-gray-200">
                            <Text className="text-lg font-bold text-gray-900">Select Currency</Text>
                        </View>
                        <FlatList
                            data={currencies}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => {
                                        setCurrency(item.code);
                                        setModalVisible(false);
                                    }}
                                    className={`flex-row items-center justify-between px-5 py-4 border-b border-gray-100 ${selectedCurrency === item.code ? 'bg-babyshopSky/10' : ''}`}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <Text className="text-lg">{item.symbol}</Text>
                                        <View>
                                            <Text className="font-semibold text-gray-900">{item.code}</Text>
                                            <Text className="text-xs text-gray-500">{item.name}</Text>
                                        </View>
                                    </View>
                                    {selectedCurrency === item.code && (
                                        <View className="w-5 h-5 rounded-full bg-babyshopSky items-center justify-center">
                                            <Text className="text-white text-xs font-bold">✓</Text>
                                        </View>
                                    )}
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
