const VOWELS_MAP: Record<string, { [key: number]: string }> = {
  'a': { 0: 'a', 1: 'á', 2: 'à', 3: 'ả', 4: 'ã', 5: 'ạ' },
  'ă': { 0: 'ă', 1: 'ắ', 2: 'ằ', 3: 'ẳ', 4: 'ẵ', 5: 'ặ' },
  'â': { 0: 'â', 1: 'ấ', 2: 'ầ', 3: 'ẩ', 4: 'ẫ', 5: 'ậ' },
  'e': { 0: 'e', 1: 'é', 2: 'è', 3: 'ẻ', 4: 'ẽ', 5: 'ẹ' },
  'ê': { 0: 'ê', 1: 'ế', 2: 'ề', 3: 'ể', 4: 'ễ', 5: 'ệ' },
  'i': { 0: 'i', 1: 'í', 2: 'ì', 3: 'ỉ', 4: 'ĩ', 5: 'ị' },
  'o': { 0: 'o', 1: 'ó', 2: 'ò', 3: 'ỏ', 4: 'õ', 5: 'ọ' },
  'ô': { 0: 'ô', 1: 'ố', 2: 'ồ', 3: 'ổ', 4: 'ỗ', 5: 'ộ' },
  'ơ': { 0: 'ơ', 1: 'ớ', 2: 'ờ', 3: 'ở', 4: 'ỡ', 5: 'ợ' },
  'u': { 0: 'u', 1: 'ú', 2: 'ù', 3: 'ủ', 4: 'ũ', 5: 'ụ' },
  'ư': { 0: 'ư', 1: 'ứ', 2: 'ừ', 3: 'ử', 4: 'ữ', 5: 'ự' },
  'y': { 0: 'y', 1: 'ý', 2: 'ỳ', 3: 'ỷ', 4: 'ỹ', 5: 'ỵ' },
  'A': { 0: 'A', 1: 'Á', 2: 'À', 3: 'Ả', 4: 'Ã', 5: 'Ạ' },
  'Ă': { 0: 'Ă', 1: 'Ắ', 2: 'Ằ', 3: 'Ẳ', 4: 'Ẵ', 5: 'Ặ' },
  'Â': { 0: 'Â', 1: 'Ấ', 2: 'Ầ', 3: 'Ẩ', 4: 'Ẫ', 5: 'Ậ' },
  'E': { 0: 'E', 1: 'É', 2: 'È', 3: 'Ẻ', 4: 'Ẽ', 5: 'Ẹ' },
  'Ê': { 0: 'Ê', 1: 'Ế', 2: 'Ề', 3: 'Ể', 4: 'Ễ', 5: 'Ệ' },
  'I': { 0: 'I', 1: 'Í', 2: 'Ì', 3: 'Ỉ', 4: 'Ĩ', 5: 'Ị' },
  'O': { 0: 'O', 1: 'Ó', 2: 'Ò', 3: 'Ỏ', 4: 'Õ', 5: 'Ọ' },
  'Ô': { 0: 'Ô', 1: 'Ố', 2: 'Ồ', 3: 'Ổ', 4: 'Ỗ', 5: 'Ộ' },
  'Ơ': { 0: 'Ơ', 1: 'Ớ', 2: 'Ờ', 3: 'Ở', 4: 'Ỡ', 5: 'Ợ' },
  'U': { 0: 'U', 1: 'Ú', 2: 'Ù', 3: 'Ủ', 4: 'Ũ', 5: 'Ụ' },
  'Ư': { 0: 'Ư', 1: 'Ứ', 2: 'Ừ', 3: 'Ử', 4: 'Ữ', 5: 'Ự' },
  'Y': { 0: 'Y', 1: 'Ý', 2: 'Ỳ', 3: 'Ỷ', 4: 'Ỹ', 5: 'Ỵ' }
};

const TONE_REVERSE_MAP: Record<string, { base: string, tone: number }> = {};
for (const [base, tones] of Object.entries(VOWELS_MAP)) {
  for (const [toneStr, tonedChar] of Object.entries(tones)) {
    const tone = parseInt(toneStr, 10);
    if (tone > 0) {
      TONE_REVERSE_MAP[tonedChar] = { base, tone };
    }
  }
}

// Helper to check if a character is a vowel
function isVowel(char: string): boolean {
  const normalized = char.toLowerCase();
  return normalized in VOWELS_MAP || normalized in TONE_REVERSE_MAP;
}

// Helper to strip tone from a character, returning the tone-free character and the tone number
function stripToneChar(char: string): { base: string, tone: number } {
  if (char in TONE_REVERSE_MAP) {
    return TONE_REVERSE_MAP[char];
  }
  return { base: char, tone: 0 };
}

// Apply tone to a specific character
function applyToneToChar(char: string, tone: number): string {
  const { base } = stripToneChar(char);
  const tones = VOWELS_MAP[base];
  if (tones && tones[tone] !== undefined) {
    return tones[tone];
  }
  return char;
}

// Find the index of the vowel that should receive the tone mark in Vietnamese spelling rules
function findToneVowelIndex(chars: string[]): number {
  const vowelIndices: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    if (isVowel(chars[i])) {
      vowelIndices.push(i);
    }
  }

  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  // Join vowels to analyze
  const vowelStr = vowelIndices.map(idx => stripToneChar(chars[idx]).base.toLowerCase()).join('');

  // Rules for double vowels
  if (vowelIndices.length === 2) {
    // ua, ia, ya -> tone on first vowel
    if (vowelStr === 'ua' || vowelStr === 'ia' || vowelStr === 'ya') {
      return vowelIndices[0];
    }
    // uy -> tone on second vowel (y)
    if (vowelStr === 'uy') {
      return vowelIndices[1];
    }
    
    // If there's a consonant after the vowels, tone goes to the second vowel
    const lastVowelIdx = vowelIndices[1];
    if (lastVowelIdx < chars.length - 1 && !isVowel(chars[lastVowelIdx + 1])) {
      return vowelIndices[1];
    }
    
    // Default for double vowels: tone on second vowel
    return vowelIndices[1];
  }

  // Rules for triple vowels (e.g., iêu, oai, oay, uây, ươi, uyê)
  if (vowelIndices.length === 3) {
    // uyê -> tone on ê (index 2)
    if (vowelStr === 'uye') {
      return vowelIndices[2];
    }
    // Default for triple vowels: tone on the middle vowel
    return vowelIndices[1];
  }

  return vowelIndices[0];
}

export function translateWord(word: string, mode: 'telex' | 'vni'): string {
  if (!word) return '';

  let chars = word.split('');
  let tone = 0;
  let hasManualTone = false;

  // For Telex, we can process sequentially
  if (mode === 'telex') {
    const output: string[] = [];
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const lowerChar = char.toLowerCase();
      const prev = output[output.length - 1];
      const prevLower = prev ? prev.toLowerCase() : '';

      // 1. Double character modifiers
      if (lowerChar === 'a' && prevLower === 'a') {
        output[output.length - 1] = prev === 'A' ? 'Â' : 'â';
      } else if (lowerChar === 'e' && prevLower === 'e') {
        output[output.length - 1] = prev === 'E' ? 'Ê' : 'ê';
      } else if (lowerChar === 'o' && prevLower === 'o') {
        output[output.length - 1] = prev === 'O' ? 'Ô' : 'ô';
      } else if (lowerChar === 'd' && prevLower === 'd') {
        output[output.length - 1] = prev === 'D' ? 'Đ' : 'đ';
      } 
      // 2. 'w' modifier
      else if (lowerChar === 'w') {
        if (prevLower === 'a') {
          output[output.length - 1] = prev === 'A' ? 'Ă' : 'ă';
        } else if (prevLower === 'o') {
          output[output.length - 1] = prev === 'O' ? 'Ơ' : 'ơ';
        } else if (prevLower === 'u') {
          output[output.length - 1] = prev === 'U' ? 'Ư' : 'ư';
        } else {
          // 'w' typed independently. In Telex, typing 'w' can turn 'u' -> 'ư' and 'o' -> 'ơ' in the word
          let modified = false;
          for (let j = 0; j < output.length; j++) {
            const { base, tone: t } = stripToneChar(output[j]);
            const baseLower = base.toLowerCase();
            if (baseLower === 'u') {
              output[j] = applyToneToChar(output[j] === 'U' ? 'Ư' : 'ư', t);
              modified = true;
            } else if (baseLower === 'o') {
              output[j] = applyToneToChar(output[j] === 'O' ? 'Ơ' : 'ơ', t);
              modified = true;
            }
          }
          if (!modified) {
            output.push(char); // Keep literal 'w' if no u/o found
          }
        }
      }
      // 3. Tone keys: s (sắc), f (huyền), r (hỏi), x (ngã), j (nặng), z (xóa dấu)
      else if (['s', 'f', 'r', 'x', 'j', 'z'].includes(lowerChar) && output.some(c => isVowel(c))) {
        hasManualTone = true;
        if (lowerChar === 's') tone = 1;
        else if (lowerChar === 'f') tone = 2;
        else if (lowerChar === 'r') tone = 3;
        else if (lowerChar === 'x') tone = 4;
        else if (lowerChar === 'j') tone = 5;
        else if (lowerChar === 'z') tone = 0;
      } 
      // 4. Normal characters
      else {
        output.push(char);
      }
    }

    // Apply the tone to the correct vowel if a tone key was pressed
    if (hasManualTone) {
      // First, strip existing tones from all characters in the output
      for (let i = 0; i < output.length; i++) {
        const { base } = stripToneChar(output[i]);
        output[i] = base;
      }
      
      if (tone > 0) {
        const toneIdx = findToneVowelIndex(output);
        if (toneIdx !== -1) {
          output[toneIdx] = applyToneToChar(output[toneIdx], tone);
        }
      }
    }

    return output.join('');
  } 
  
  // For VNI
  else {
    const output: string[] = [];
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const prev = output[output.length - 1];
      const prevLower = prev ? prev.toLowerCase() : '';

      // VNI Modifiers and Tones
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(char)) {
        if (char === '6') {
          if (prevLower === 'a') output[output.length - 1] = prev === 'A' ? 'Â' : 'â';
          else if (prevLower === 'e') output[output.length - 1] = prev === 'E' ? 'Ê' : 'ê';
          else if (prevLower === 'o') output[output.length - 1] = prev === 'O' ? 'Ô' : 'ô';
          else output.push(char);
        } else if (char === '7') {
          if (prevLower === 'o') output[output.length - 1] = prev === 'O' ? 'Ơ' : 'ơ';
          else if (prevLower === 'u') output[output.length - 1] = prev === 'U' ? 'Ư' : 'ư';
          else {
            // Check if we can modify u and o in the word
            let modified = false;
            for (let j = 0; j < output.length; j++) {
              const { base, tone: t } = stripToneChar(output[j]);
              const baseLower = base.toLowerCase();
              if (baseLower === 'u') {
                output[j] = applyToneToChar(output[j] === 'U' ? 'Ư' : 'ư', t);
                modified = true;
              } else if (baseLower === 'o') {
                output[j] = applyToneToChar(output[j] === 'O' ? 'Ơ' : 'ơ', t);
                modified = true;
              }
            }
            if (!modified) output.push(char);
          }
        } else if (char === '8') {
          if (prevLower === 'a') output[output.length - 1] = prev === 'A' ? 'Ă' : 'ă';
          else output.push(char);
        } else if (char === '9') {
          if (prevLower === 'd') output[output.length - 1] = prev === 'D' ? 'Đ' : 'đ';
          else output.push(char);
        } else if (output.some(c => isVowel(c))) {
          // It's a tone mark: 1, 2, 3, 4, 5, 0
          hasManualTone = true;
          if (char === '1') tone = 1;
          else if (char === '2') tone = 2;
          else if (char === '3') tone = 3;
          else if (char === '4') tone = 4;
          else if (char === '5') tone = 5;
          else if (char === '0') tone = 0;
        } else {
          output.push(char);
        }
      } else {
        output.push(char);
      }
    }

    // Apply the tone to the correct vowel if a tone key was pressed
    if (hasManualTone) {
      // First, strip existing tones from all characters in the output
      for (let i = 0; i < output.length; i++) {
        const { base } = stripToneChar(output[i]);
        output[i] = base;
      }
      
      if (tone > 0) {
        const toneIdx = findToneVowelIndex(output);
        if (toneIdx !== -1) {
          output[toneIdx] = applyToneToChar(output[toneIdx], tone);
        }
      }
    }

    return output.join('');
  }
}

export function translateSentence(text: string, mode: 'telex' | 'vni'): string {
  if (!text) return '';

  // Simple word-by-word translation preserving spaces and punctuation
  const wordsAndPunct = text.split(/(\s+)/);
  return wordsAndPunct.map(part => {
    if (/^\s+$/.test(part)) {
      return part; // Return spaces as-is
    }
    
    // If the word contains punctuation at the end, separate it
    const match = part.match(/^([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
    if (match) {
      const word = match[1];
      const punct = match[2];
      return translateWord(word, mode) + punct;
    }
    
    return part;
  }).join('');
}
