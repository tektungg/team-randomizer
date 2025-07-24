# Team Randomizer

A modern, minimalistic web application for randomizing teams with drag-and-drop functionality. Perfect for organizing groups, sports teams, study groups, or any scenario where you need to divide people into balanced teams.

![Team Randomizer](https://img.shields.io/badge/Version-1.2-blue) ![HTML](https://img.shields.io/badge/HTML-5-orange) ![CSS](https://img.shields.io/badge/CSS-3-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

## Features

✨ **Smart Randomization** - Automatically distributes members evenly across teams
🎯 **Intelligent Distribution** - Handles uneven splits gracefully (extra members go to first teams)
🖱️ **Drag & Drop** - Full drag-and-drop support for manual team adjustments
🔄 **Member Swapping** - Drag one person onto another to swap their positions
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
🎨 **Modern UI** - Clean, minimalistic design with smooth animations
⚡ **Fast & Lightweight** - Pure HTML/CSS/JavaScript with no dependencies

## How to Use

### 1. Basic Setup
1. Just open https://tektungg.github.io/team-randomizer/, or:
2. Open the `index.html` file in any modern web browser
3. No installation or server setup required!

### 2. Input Your Data
1. **Enter Names**: Type participant names in the text area, one name per line
   ```
   John Doe
   Jane Smith
   Mike Johnson
   Sarah Wilson
   Alex Brown
   ```

2. **Set Team Count**: Use the number input to specify how many teams you want (minimum 2)

### 3. Randomize Teams
1. Click the **"Randomize"** button
2. The application will automatically:
   - Shuffle all names randomly
   - Distribute them evenly across teams
   - Handle uneven distributions intelligently

### 4. Manual Adjustments (Optional)
After randomization, you can manually adjust teams using drag and drop:

**Move to Different Team:**
- Drag a person's name to an empty area of another team
- They will be moved to that team

**Swap Positions:**
- Drag a person's name directly onto another person's name
- They will swap teams instantly

## Distribution Logic

The application uses intelligent distribution for uneven splits:

- **10 people, 4 teams** → Teams A(3), B(3), C(2), D(2)
- **11 people, 3 teams** → Teams A(4), B(4), C(3)
- **7 people, 3 teams** → Teams A(3), B(2), C(2)

Extra members are always assigned to the first teams alphabetically.

## Technical Details

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Technologies Used
- **HTML5** - Semantic markup and drag-and-drop API
- **CSS3** - Modern styling with flexbox, grid, and animations
- **Vanilla JavaScript** - No frameworks or dependencies
- **Responsive Design** - Mobile-first approach

### File Structure
```
team-randomizer/
├── index.html          # Main application file
└── README.md          # This documentation
```

## Use Cases

🏫 **Education**
- Divide students into study groups
- Create project teams
- Organize classroom activities

⚽ **Sports & Recreation**
- Form sports teams
- Create tournament brackets
- Organize game groups

💼 **Business & Events**
- Workshop breakout sessions
- Team-building activities
- Conference networking groups

🎮 **Gaming & Social**
- Gaming tournaments
- Party games organization
- Social event planning

## Tips & Best Practices

### Input Guidelines
- Use clear, readable names
- One name per line only
- Avoid special characters if possible
- Remove extra spaces or blank lines

### Team Management
- Start with randomization, then adjust manually if needed
- Use drag-and-drop for quick fixes
- Team names are automatically assigned (Team A, B, C, etc.)

### Performance
- Handles up to 1000+ names efficiently
- Works smoothly on mobile devices

## Troubleshooting

**Q: Some features doesn't work**
A: Try hard refresh the page (Ctrl + F5 or Ctrl + Shift + R)

**Q: The randomize button doesn't work**
A: Ensure you have entered at least as many names as the number of teams specified

**Q: Drag and drop isn't working**
A: Make sure you're using a modern browser that supports HTML5 drag-and-drop

**Q: Names appear cut off on mobile**
A: The design is responsive, but very long names might wrap. Consider shortening names if needed

**Q: Can I save the team results?**
A: Currently, results are not saved automatically. You can take a screenshot or manually copy the results

## Future Enhancements

🔮 **Planned Features**
- Export results to PDF/CSV
- Save/load team configurations
- Custom team names
- Team history tracking
- Advanced distribution algorithms
- Dark mode theme ✅

## Contributing

Found a bug or have a feature request? This project welcomes contributions and feedback!

## License

This project is open source and available under the MIT License.

---

**Made with ♥ by Rama Pramudhita Bhaskara** | Version 1.0 | 2025
