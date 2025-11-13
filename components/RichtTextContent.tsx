'use dom';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import '@/global.css';
import { View } from 'react-native';
import { DOMProps } from 'expo/dom';

const RichtTextContent = ({
    blockContent,
    colorScheme = 'light'
  }: {
    blockContent: BlocksContent;
    colorScheme?: 'light' | 'dark';
    dom?: DOMProps
  }) => {
  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      <BlocksRenderer content={blockContent} />
    </View>
  );
};
export default RichtTextContent;
