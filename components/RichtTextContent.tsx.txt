// 'use dom';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import '@/global.css';
import { View, Text } from 'react-native';
import { DOMProps } from 'expo/dom';

// const RichtTextContent = ({ blockContent, colorScheme }) => {
const RichtTextContent = ({
    blockContent,
    colorScheme = 'light'
  }: {
    blockContent: BlocksContent;
    colorScheme?: 'light' | 'dark';
    dom?: DOMProps
  }) => {
  return (
    <View style={{ borderWidth: 2, borderColor: 'blue', padding: 12 }}>
      <Text style={{ color: colorScheme === "dark" ? "white" : "black" }}>
        RENDERING TEMP BLOCK CONTENT:
      </Text>

      {blockContent?.map((b, i) => (
        <Text key={i} style={{ marginTop: 8, color: 'green' }}>
          {JSON.stringify(b)}
        </Text>
      ))}
    </View>
  );
};

// const RichtTextContent = ({
//     blockContent,
//     colorScheme = 'light'
//   }: {
//     blockContent: BlocksContent;
//     colorScheme?: 'light' | 'dark';
//     dom?: DOMProps
//   }) => {
//   return (
//     <View className={`${colorScheme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}
//       style={{borderWidth: 1, borderColor: 'red'}}
//     >
//     {/* <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}> */}
//       <BlocksRenderer content={blockContent} />
//       {/* Below code is to test intermittent issue of Notes being rendered as blank in Android release app.
//         We need to find out if BlocksRenderer which is a React component trips up in Android release app. */}
//       <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
//         Testing data given below:
//       </Text>
//       <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
//         {JSON.stringify(blockContent)}
//       </Text>
//     </View>
//   );
// };
export default RichtTextContent;
