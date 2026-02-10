# 📦 react-native-pip-view

A lightweight, customizable **Picture-in-Picture (PiP)** component for **React Native**, mimicking the iOS native PiP window behavior – all within your app. Supports dragging, edge snapping, hideability, and an optional destroy (close) area.

---

## Demo: 
https://x.com/tsolfitsmexx/status/1912752417176793170?s=46&t=kx6uESwbDrRgTUOCDr1tMQ

## ✨ Features

- 🧲 Snap to screen edges  
- 🕳️ Optional destroy area  
- 📏 Resizing
- 🔽 Can hide the PiP window when dropped near the edge  
- 🔄 customizable layout and behavior 

---

## 🚀 Installation

```bash
npm install react-native-pip-view
# or
yarn add react-native-pip-view
```

---

## 📦 Usage

```tsx
import { PiPView } from 'react-native-pip-view';
import { View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  return (
    <PiPView
      hideable
      snapToEdges
      onDestroy={() => console.log('PiP destroyed')}
      destroyArea={{
        position: {
          height: 80,
          width: 120,
          x: (width - 120) / 2,
          y: height - 180,
        },
        activeColor: 'red',
        inactiveColor: 'blue',
      }}
      initialPosition={{
        x: 0,
        y: 0,
      }}
      layout={{
        width: width,
        height: height - 80,
        y: 100,
        x: 0,
        horizontalOffset: 12,
      }}
    >
      <View style={{ width: 120, height: 80, backgroundColor: 'gray' }} />
    </PiPView>
  );
}
```

---

## 🧩 Props

| Prop              | Type                                           | Description                                                                        |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| `disabled`        | `boolean`                                      | Disables dragging and interactions when `true`.                                    |
| `destroyArea`     | `DestroyArea`                                  | An optional area where the PiP can be dragged to close.                            |
| `initialPosition` | `{ x: number; y: number; }`                    | Optional initial x/y position of the PiP view within provided layout dimensions.   |
| `hideable`        | `boolean`                                      | Enables auto-hiding near screen edge.                                              |
| `layout`          | `ScreenLayoutDimensions`                       | Defines available movement area. **Required.**                                     |
| `snapToEdges`     | `boolean`                                      | Automatically snaps the PiP to the nearest screen edge.                            |
| `onDestroy`       | `() => void`                                   | Callback triggered when PiP is dropped in the destroy area.                        |
| `onPress`         | `() => void`                                   | Callback triggered on PiP tap.                                                     |
| `edgeHandle`      | `{ left: ReactElement; right: ReactElement; }` | Customizable left and right handles that appear when the PiP is hidden off-screen. |

### 🔻 `DestroyArea`

```ts
interface DestroyArea {
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  activeColor?: string;
  inactiveColor?: string;
}
```

---

### 📐 `ScreenLayoutDimensions`

> ⚠️ **Important:** If you enable `snapToEdges`, make sure the `layout.width` matches the full screen width. This ensures the PiP view can properly align with screen edges.
> You can also use the optional `horizontalOffset` prop to add padding between the PiP view and the screen edge after snapping. This helps prevent the PiP from being flush against the edge.

```ts
interface ScreenLayoutDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  horizontalOffset?: number;
}
```

---

## 💡 Inspiration

Inspired by iOS Picture-in-Picture, this component enables similar interaction in-app for content like video previews, chat heads, or widgets.

---

## 🧑‍💻 Contributing

Pull requests are welcome! If you have suggestions or improvements, feel free to open an issue.

---

## 📄 License

MIT