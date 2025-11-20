import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';

/**
 * Defensive, minimal Strapi Blocks -> React Native renderer.
 * Extend this with custom block types as required.
 *
 * Note: Strapi block structure differs depending on configuration.
 * This renderer attempts to detect several common shapes and handle them.
 */

type BlocksContent = any; // keep loose so it's tolerant of Strapi shapes

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  paragraph: { marginBottom: 8, lineHeight: 20 },
  heading1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  heading2: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  heading3: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  listItem: { marginBottom: 4, paddingLeft: 12 },
  quote: { padding: 12, borderLeftWidth: 4, borderLeftColor: '#ccc', backgroundColor: '#f8f8f8', marginBottom: 8 },
  codeBlock: { fontFamily: 'monospace', backgroundColor: '#eee', padding: 8, borderRadius: 4, marginBottom: 8 },
  image: { width: '100%', height: 180, resizeMode: 'cover', marginVertical: 8, borderRadius: 6 },
  link: { color: '#007aff', textDecorationLine: 'underline' },
  unknown: { padding: 8, backgroundColor: '#fff3cd', borderRadius: 4, marginBottom: 8 },
});

/** Render inline spans with simple mark support: bold, italic, underline, link */
const renderInline = (node: any, key: number | string) => {
  // Many Strapi block formats use node.text and node.marks or node.type/attrs.
  const text = node?.text ?? (typeof node === 'string' ? node : '');
  const marks = node?.marks ?? node?.attributes ?? [];

  // Convert marks to styles
  const isBold = marks?.some((m: any) => m === 'bold' || m?.type === 'bold');
  const isItalic = marks?.some((m: any) => m === 'italic' || m?.type === 'italic');
  const isUnderline = marks?.some((m: any) => m === 'underline' || m?.type === 'underline');
  const link = marks?.find((m: any) => (m?.type === 'link') || (m?.href || m?.url));

  const textStyle: any = {};
  if (isBold) textStyle.fontWeight = '700';
  if (isItalic) textStyle.fontStyle = 'italic';
  if (isUnderline) textStyle.textDecorationLine = 'underline';

  if (link) {
    const url = link?.href || link?.url || link?.attrs?.href;
    return (
      <Text
        key={key}
        style={[textStyle, styles.link]}
        onPress={() => {
          if (url) Linking.openURL(url).catch(() => {});
        }}>
        {text}
      </Text>
    );
  }

  return (
    <Text key={key} style={textStyle}>
      {text}
    </Text>
  );
};

/** Render a single block object */
const renderBlock = (block: any, index: number) => {
  if (!block) return null;

  // Case 1: Some Strapi blocks come as { type: 'paragraph', data: { text: '...' } }
  if (block.type === 'paragraph' && block.data?.text) {
    return (
      <Text key={index} style={styles.paragraph}>
        {block.data.text}
      </Text>
    );
  }

  // Case 2: Prose mirror: { type: 'heading', attrs: { level: 2 }, content: [...] } or {type: 'heading', data: { level, text } }
  if (block.type === 'heading' || block.type === 'heading-block') {
    const level = block.data?.level ?? block.attrs?.level ?? (block?.level ?? 2);
    const text =
      block.data?.text ??
      (Array.isArray(block.content) ? block.content.map((c: any) => c.text ?? '').join('') : block.text ?? '');
    const style = level === 1 ? styles.heading1 : level === 2 ? styles.heading2 : styles.heading3;
    return (
      <Text key={index} style={style}>
        {text}
      </Text>
    );
  }

  // Case 3: Paragraphs presented as content children (common AST-like shapes)
  if (block.type === 'paragraph' || block.nodeType === 'paragraph') {
    const children = block.content ?? block.children ?? block.data?.content;
    if (Array.isArray(children)) {
      return (
        <Text key={index} style={styles.paragraph}>
          {children.map((c: any, i: number) => renderInline(c, String(i)))}
        </Text>
      );
    }
  }

  // Case 4: Lists — ordered/unordered
  if (block.type === 'bullet_list' || block.type === 'ordered_list' || block.nodeType === 'list') {
    const items = block.content ?? block.items ?? block.data?.items ?? [];
    const ordered = block.type === 'ordered_list' || block.ordered;
    return (
      <View key={index} style={{ marginBottom: 8 }}>
        {items.map((li: any, i: number) => {
          const liChildren = li.content ?? li.children ?? li.data?.content ?? [];
          const bullet = ordered ? `${i + 1}. ` : '\u2022 ';
          const liText = Array.isArray(liChildren) ? liChildren.map((c: any) => c.text ?? '').join('') : liChildren?.text ?? '';
          return (
            <Text key={i} style={styles.listItem}>
              {bullet}
              <Text>{liText}</Text>
            </Text>
          );
        })}
      </View>
    );
  }

  // Case 5: Image blocks: many shapes exist. Try common fields.
  if (block.type === 'image' || block.__component?.includes?.('image') || block.name === 'image') {
    const url = block.data?.url ?? block.url ?? block.attributes?.url ?? block.image?.url ?? block.src;
    const caption = block.data?.caption ?? block.caption ?? block.altText ?? block.attributes?.alternativeText;
    if (url) {
      return (
        <View key={index} style={{ marginVertical: 8 }}>
          <Image source={{ uri: url }} style={styles.image} />
          {caption ? <Text style={{ fontSize: 12, color: '#666' }}>{caption}</Text> : null}
        </View>
      );
    }
  }

  // Case 6: Quote
  if (block.type === 'quote' || block.nodeType === 'blockquote' || block.__component?.includes?.('quote')) {
    const text = block.data?.text ?? (Array.isArray(block.content) ? block.content.map((c: any) => c.text ?? '').join('') : block.text ?? '');
    return (
      <View key={index} style={styles.quote}>
        <Text>{text}</Text>
      </View>
    );
  }

  // Case 7: Code block
  if (block.type === 'code' || block.nodeType === 'code-block' || block.__component?.includes?.('code')) {
    const code = block.data?.code ?? block.code ?? block.text ?? '';
    return (
      <View key={index}>
        <Text style={styles.codeBlock}>{code}</Text>
      </View>
    );
  }

  // Case 8: Generic content where block contains content array (walk children)
  if (Array.isArray(block.content) && block.content.length > 0) {
    return (
      <Text key={index} style={styles.paragraph}>
        {block.content.map((c: any, i: number) => renderInline(c, String(i)))}
      </Text>
    );
  }

  // Unknown block fallback — helpful while developing
  return (
    <View key={index} style={styles.unknown}>
      <Text>Unsupported block type - debugging output:</Text>
      <Text style={{ fontSize: 12 }}>{JSON.stringify(block)}</Text>
    </View>
  );
};

export default function StrapiBlocksRenderer({
  blockContent,
  colorScheme = 'light',
}: {
  blockContent?: BlocksContent;
  colorScheme?: 'light' | 'dark';
}) {
  if (!blockContent) return null;

  // Some Strapi responses wrap blocks under data[0].attributes.blocks or similar.
  // Normalize: if top-level object has data/attributes, attempt to reach array.
  let blocks = blockContent;
  if (blocks?.data && Array.isArray(blocks.data)) blocks = blocks.data;
  if (blocks?.attributes?.blocks) blocks = blocks.attributes.blocks;
  if (!Array.isArray(blocks) && typeof blocks === 'object') {
    // sometimes it's { content: [...] }
    if (Array.isArray(blocks.content)) blocks = blocks.content;
    else if (Array.isArray(blocks.blocks)) blocks = blocks.blocks;
  }

  if (!Array.isArray(blocks)) {
    // If it's not an array still, render debug
    return (
      <View style={[styles.container]}>
        <Text>Unexpected blocks shape (debug):</Text>
        <Text style={{ fontSize: 12 }}>{JSON.stringify(blocks)}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
      <View style={[styles.container]}>
        {blocks.map((b: any, i: number) => renderBlock(b, i))}
      </View>
    </ScrollView>
  );
}
