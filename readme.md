<!-- Study Quest Leveling System -->
<div align="center">

# 🎮 **STUDY QUEST LEVELING SYSTEM** ⭐

*Transform Your Learning Journey Into an Epic Adventure*

---

</div>

## ✨ About This Project

This application is a collaborative masterpiece crafted by 4 talented developers, designed to revolutionize the way students engage with educational content. **Study Quest** gamifies the learning experience, turning mundane study sessions into thrilling quests where users earn experience points, level up their skills, unlock achievements, and collect badges across multiple subjects.

### 🎯 Core Features
- **🏆 Gamified Learning** - Earn XP and level up in Math, Physics, Biology, and more
- **🎖️ Badge & Trophy System** - Unlock achievements as you progress
- **📊 Subject Progression** - Track individual subject levels independently
- **🎓 Interactive Quizzes** - Engage with difficulty-scaled challenges
- **⚡ Multiplayer Mode** - Race against AI opponents in timed quiz battles
- **💾 Persistent Progress** - Your achievements are saved locally
- **🔐 Authentication** - Secure login system for personalized profiles
- **👤 User Profiles** - Customize your learning profile and view statistics

---

## 📦 Project Structure

```
CSC541---Group-Project/
├── index.html           # Main landing page
├── home.html            # Dashboard & home screen
├── quests.html          # Quest selection & gameplay
├── multiplayer.html     # Multiplayer battle mode
├── auth.html            # Authentication/login interface
├── profile.html         # User profile & statistics
├── test-signin.html     # Testing utilities
├── app.js               # Core application logic
├── multiplayer.js       # Multiplayer game logic
├── Assets/
│   └── style.css        # Global styling & UI
└── readme.md            # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required (client-side application)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CSC541---Group-Project.git
   cd CSC541---Group-Project
   ```

2. Open in your browser:
   - Simply open `index.html` in your preferred web browser
   - Or use a local server for better experience:
     ```bash
     # If you have Python installed
     python -m http.server 8000
     # Then navigate to http://localhost:8000
     ```

---

## 🧪 Testing Instructions

### Manual Testing Checklist

#### 1️⃣ **Authentication Testing**
- Navigate to `auth.html` or click "Login" on the home page
- Test login with various credentials
- Verify error handling for invalid inputs
- Confirm session persistence using browser DevTools (Application > LocalStorage)

#### 2️⃣ **Quest Gameplay Testing**
- Access `quests.html` from the main menu
- Click on different quest cards (Math, Physics, Biology)
- Complete quiz questions and verify:
  - ✅ Correct answers award XP
  - ❌ Wrong answers provide feedback
  - Progress bar updates correctly
  - XP is added to user total and subject-specific levels

#### 3️⃣ **Profile & Progression Testing**
- Visit `profile.html` to verify:
  - User name displays correctly
  - Trophy count is accurate
  - Subject levels and XP thresholds display properly
  - Badges/achievements populate as they're earned

#### 4️⃣ **Multiplayer Mode Testing**
- Navigate to `multiplayer.html` from the bottom navigation
- Select a subject (Math, Physics, Biology, History)
- Click "Start Game" to begin a multiplayer match
- Verify gameplay elements:
  - ✅ 10 questions appear in sequence
  - ✅ Player scores update in real-time
  - ✅ Opponent AI generates random answers
  - ✅ Correct/incorrect answer feedback displays properly
  - ✅ Game progresses to next question after 1.5 seconds
- After all 10 questions, verify results:
  - ✅ Ranking correctly determined (1st: 10/10, 2nd: 8/10, 3rd: 6/10 or less)
  - ✅ Podium shows correct placement and scores
  - ✅ "Play Again" button resets the game
  - ✅ "Back to Menu" returns to subject selection

#### 5️⃣ **Data Persistence Testing**
- Complete some quests and earn XP
- Refresh the page (F5 or Ctrl+R)
- Verify that all progress is maintained
- Check browser LocalStorage (`STUDY_LEVELING_V1` key)

#### 6️⃣ **UI/UX Testing**
- Test responsiveness by resizing browser window
- Verify all buttons and links are functional
- Check color schemes and visual hierarchy
- Test navigation between all pages
- Verify animations and transitions work smoothly

#### 7️⃣ **Browser Compatibility**
- Test on Chrome, Firefox, Safari, and Edge
- Check console for any JavaScript errors (F12)
- Verify localStorage works across browsers

### Automated Testing (Optional)
Use browser DevTools Console to run manual tests:
```javascript
// Check current game state
console.log(JSON.parse(localStorage.getItem('study_leveling_v1')));

// Reset progress (for testing)
localStorage.removeItem('study_leveling_v1');
location.reload();

// Manually add XP (debug mode)
let state = JSON.parse(localStorage.getItem('study_leveling_v1'));
state.user.xp += 100;
localStorage.setItem('study_leveling_v1', JSON.stringify(state));
```

---

## 🎮 How to Play

1. **Start Your Journey** - Create or log into your profile
2. **Select a Subject** - Choose from Math, Physics, Biology, and more
3. **Accept Quests** - Pick from available challenges with varying difficulty
4. **Answer Questions** - Complete interactive quizzes to earn XP
5. **Level Up** - Accumulate XP to increase your subject and overall level
6. **Unlock Achievements** - Earn badges and trophies for milestones
7. **Compete & Progress** - Track your growth across subjects

---

## 💡 Development Notes

- **State Management**: Uses in-memory state with localStorage persistence
- **Frontend-Only**: No backend server required
- **Difficulty Scaling**: Quests adapt based on user level
- **XP System**: Dynamic thresholds based on subject progression

---

## 👥 Team

Built with ❤️ by a collaborative team of 4 developers at CSC541

---

## 📄 License

This project is part of an academic collaboration.

---

## 🌟 Future Enhancements

- [ ] Multiplayer leaderboards
- [ ] Spaced repetition algorithm
- [ ] Dark mode toggle

---

<div align="center">

**Start studying smarter, not harder. Begin your quest today! 🚀**

</div>
