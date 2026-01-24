from typing import List, Tuple
import json

def popcount(n: int) -> int:
    """Counts set bits in an integer."""
    return bin(n).count('1')

def calculate_similarity(clip_fp: List[int], song_fp: List[int]) -> Tuple[float, float]:
    """
    Finds the best match of clip_fp within song_fp.
    Returns (similarity_score, confidence).
    Similarity is 0.0 to 1.0.
    """
    if not clip_fp or not song_fp:
        return 0.0, 0.0
    
    # If clip is longer than song, swap or just fail? usually clip is shorter.
    # But if user uploads a whole song as "clip", handles it.
    if len(clip_fp) > len(song_fp):
        # Swap logic or just partial match? Let's check the start.
        # Ideally we slide the shorter one over the longer one.
        short = song_fp
        long_seq = clip_fp
    else:
        short = clip_fp
        long_seq = song_fp

    len_short = len(short)
    len_long = len(long_seq)
    
    best_error = float('inf')
    
    # Simple sliding window
    # Optimized in C usually, but Python for simplicity here.
    # To speed up, we might skip steps or check only every Nth offset if needed, 
    # but for accuracy we check all.
    
    # Early optimization: if difference in length is huge, this loop is big.
    # We can assume a max offset scan if we want, but let's do full scan for correctness.
    
    for i in range(len_long - len_short + 1):
        # Calculate bit error for this alignment
        total_error = 0
        for j in range(len_short):
            # XOR gives diff, popcount gives Hamming distance
            diff = short[j] ^ long_seq[i+j]
            total_error += popcount(diff)
            
            # Optimization: break if error exceeds best_error already
            if total_error > best_error:
                break
        
        if total_error < best_error:
            best_error = total_error
            if best_error == 0:
                break # Exact match found

    # Max possible error = 32 bits * length
    max_error = 32 * len_short
    if max_error == 0:
        return 0.0, 0.0
        
    similarity = 1.0 - (best_error / max_error)
    
    # Confidence logic
    # If similarity > 0.9, High
    # > 0.8, Medium
    # Else Low
    return similarity, similarity * 100 # Return score and a percentage-like value

def explain_match(similarity: float) -> str:
    if similarity > 0.95:
        return "Excellent match! The audio fingerprint is nearly identical."
    elif similarity > 0.85:
        return "Good match. High confidence in fingerprint overlap."
    elif similarity > 0.7:
        return "Possible match. Some similarities found."
    else:
        return "Weak match. Results may be inaccurate."
