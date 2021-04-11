import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker, ChromePicker } from 'react-color';
import { convertCompilerOptionsFromJson, isConstructorDeclaration } from 'typescript';

const colorConvert = (color: number): string => {
  let temp = color.toString(16);
  let len = 6 - temp.length;
  for (let i = 0; i < len; i++) {
    temp = `0${temp}`;
  }
  return temp;
};

const ColorPicker = ({
  color,
  tackColor,
  index,
}: {
  color: number;
  tackColor: any;
  index: number;
}) => {
  const [pick, setPick] = React.useState<string>('');
  const [display, setDisplay] = React.useState<boolean>(false);

  React.useEffect(() => {
    setPick(`#${colorConvert(color)}`);
  }, []);

  const handleClick = () => {
    setDisplay(!display);
  };

  const handleClose = () => {
    setDisplay(false);
  };

  const handleChange = (color: any) => {
    setPick(color.hex);
    tackColor(index, color.hex);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: pick,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        // position: 'absolute',
        // zIndex: '2',
      },
      cover: {
        // position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {display ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <ChromePicker color={pick} onChangeComplete={handleChange} disableAlpha={true} />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
