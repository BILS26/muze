import {
    getEvent,
    getD3Drag
 } from 'muze-utils';

import getDragActionConfig from './helpers/drag-action-config';

export const selectionBoxDrag = firebolt => (targetEl, behaviours) => {
    let subject;
    let drawingInf;
    const context = firebolt.context;
    const onDrag = (payload) => {
        behaviours.forEach(action => firebolt.dispatchBehaviour(action, payload));
    };
    const d3Drag = getD3Drag();

    targetEl.call(d3Drag().on('start', () => {
        const event = getEvent();
        drawingInf = context.getDrawingContext();
        subject = event.subject;
    }).on('drag', () => {
        const event = getEvent();
        subject.x += event.dx;
        subject.y += event.dy;
        const width = drawingInf.width;
        const height = drawingInf.height;
        const x = Math.min(width - subject.width, Math.max(subject.x, 0));
        const y = Math.min(height - subject.height, Math.max(subject.y, 0));
        const y2 = y + subject.height;
        const x2 = x + subject.width;

        if (x >= 0 && x2 <= width && y >= 0 && y2 <= height) {
            const payload = getDragActionConfig(context, {
                startPos: {
                    x,
                    y
                },
                endPos: {
                    x: x2,
                    y: y2
                }
            });
            onDrag(payload);
        }
    }).on('end', () => {
        const width = drawingInf.width;
        const height = drawingInf.height;
        const x = Math.min(width - subject.width, Math.max(subject.x, 0));
        const y = Math.min(height - subject.height, Math.max(subject.y, 0));
        const y2 = y + subject.height;
        const x2 = x + subject.width;

        if (x >= 0 && x2 <= width && y >= 0 && y2 <= height) {
            const payload = getDragActionConfig(context, {
                startPos: {
                    x,
                    y
                },
                endPos: {
                    x: x2,
                    y: y2
                },
                snap: true
            });
            payload.dragEnd = true;
            onDrag(payload);
        }
    }));
};
