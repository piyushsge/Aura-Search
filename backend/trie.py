import heapq

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False
        self.frequency = 0
        self.word = None

class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.cache = {}

    def insert(self, word, frequency=1):
        # Clear cache on insert to ensure fresh results
        self.cache = {}
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
        node.frequency += frequency
        node.word = word

    def search(self, prefix, k=5):
        cache_key = f"prefix_{prefix}_{k}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return []
            node = node.children[char]
        
        # BFS/DFS to find all words under this node
        suggestions = []
        self._get_all_words(node, suggestions)
        
        # Sort by frequency and return top K
        results = sorted(suggestions, key=lambda x: x[1], reverse=True)[:k]
        self.cache[cache_key] = results
        return results

    def _get_all_words(self, node, suggestions):
        if node.is_end_of_word:
            suggestions.append((node.word, node.frequency))
        
        for char, child_node in node.children.items():
            self._get_all_words(child_node, suggestions)

    def fuzzy_search(self, query, k=5, threshold=2):
        cache_key = f"fuzzy_{query}_{k}_{threshold}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        # Very basic fuzzy search using Levenshtein distance
        # For a production app, we'd use something more optimized like a Burkhard-Keller Tree
        # but for this scale, we can iterate or use a simpler heuristic.
        # Let's just do a simple implementation for now.
        all_words = []
        self._get_all_words(self.root, all_words)
        
        matches = []
        for word, freq in all_words:
            dist = self._levenshtein_distance(query.lower(), word.lower())
            if dist <= threshold:
                matches.append((word, freq, dist))
        
        # Sort by distance (primary) and frequency (secondary)
        results = sorted(matches, key=lambda x: (x[2], -x[1]))[:k]
        self.cache[cache_key] = results
        return results

    def _levenshtein_distance(self, s1, s2):
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]
