import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";

export const dropdown =
  trigger('dropdown',
    [state('hidden', style
    ({
      height: '0',
      overflow: 'hidden',
      display: 'block',
      transition: 'height 1s',
      'padding-bottom': 0
    })),
      state('visible', style
      ({
        height: '*',
        display: 'block',
        transition: 'height 1s'
      })),
      transition('visible <=> hidden', [style
      ({
        overflow: 'hidden'
      }),
        animate('{{transitionParams}}')]),
      transition('void => *', animate(0))]);



export const scale =
  trigger('scale', [
    state('true', style({ width: '220px' })),
    state('false', style({ width: '*' })),
    transition('* <=> *', animate(200)),
    transition(':enter',
      [
        style({ height: '0', opacity: 0, overflow: 'hidden'}),
        animate('.4s ease-out',
          style(
            { height: '*', opacity: 1}))
      ]),
    transition(
      ':leave',
      [
        style({ height: '*', opacity: 1}),
        animate('.4s ease-in',
          style({ height: 0, overflow: 'hidden', opacity: 0}))
      ]
    )
  ]);

export const inOut =
  trigger(
    'inOut',
    [
      transition(
        ':enter',
        [
          style({ height: '0', overflow: 'hidden'}),
          animate('.4s ease-out',
            style(
              { height: '*'}))
        ]
      ),
      transition(
        ':leave',
        [
          style({ height: '*', overflow: 'hidden'}),
          animate('.4s ease-in',
            style({ height: 0}))
        ]
      )
    ]
  );

export const fadeInOut = trigger('fadeInOut',
  [
    transition(':enter',
      [
        style({opacity: 0}),
        animate('300ms',
          style({opacity: 1}))
      ]),
    transition(':leave',
      [
        style({opacity: 1}),
        animate('300ms',
          style({opacity: 0}))
      ]),
    transition('* => *',
      [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1}))
      ])
  ]);

export const rotate = trigger('rotate',
  [
    transition(':enter',
      [
        animate('450ms',
          keyframes(
            [ style({transform: 'rotate(0deg)', offset: '0'}),
              style({transform: 'rotate(1turn)', offset: '1'})
            ]
          ))
      ])
  ]);
