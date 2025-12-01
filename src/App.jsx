import React, { useState } from 'react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return React.createElement(
    'div',
    {
      style: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '7000px',
        margin: '0 auto'
      }
    },

    React.createElement(
      'div',
      // Blue top line
      React.createElement('div', {
        style: { height: '4px', backgroundColor: '#00aaff', marginBottom: '40px' }
      }),

      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' } },

      
        React.createElement(
          'div',
          { style: { flex: 1, minWidth: '300px' } },

          React.createElement('h1', { style: { fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '40px' } }, 'LOGIN'),

         
          React.createElement('div', { style: { marginBottom: '20px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', color: '#333' } },
              'Email',
              React.createElement('span', { style: { color: 'red' } }, '*')
            ),
            React.createElement('input', {
              type: 'email',
              placeholder: 'Enter your email',
              style: { width: '100%', padding: '14px 16px', backgroundColor: '#000', color: '#888', borderRadius: '8px', border: 'none', fontSize: '16px' }
            })
          ),

       
          React.createElement('div', { style: { marginBottom: '20px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', color: '#333' } },
              'Password',
              React.createElement('span', { style: { color: 'red' } }, '*')
            ),
            React.createElement('input', {
              type: 'password',
              placeholder: 'minimum 8 characters',
              style: { width: '100%', padding: '14px 16px', backgroundColor: '#000', color: '#888', borderRadius: '8px', border: 'none', fontSize: '16px' }
            })
          ),

       
          React.createElement(
            'div',
            { style: { textAlign: 'right', marginBottom: '20px' } },
            React.createElement(
              'span',
              {
                style: { color: '#e74c3c', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' },
                onClick: () => setIsModalOpen(true)
              },
              'Forgot password?'
            )
          ),

          
          React.createElement('button', {
            style: {
              width: '100%',
              padding: '14px',
              backgroundColor: '#000',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }
          }, 'LOGIN'),

          
          React.createElement('p', { style: { marginTop: '20px', color: '#666', fontSize: '14px' } },
            'Not registered yet? ',
            React.createElement('a', { href: '#', style: { color: '#e74c3c', textDecoration: 'none' } }, 'Create a new account')
          )
        ),

        
        React.createElement(
          'div',
          { style: { flex: 1, textAlign: 'center', minWidth: '300px' } },
          React.createElement('h1', { style: { fontSize: '60px', fontWeight: 900, color: '#000', margin: 0 } }, 'ProCuRe'),
          React.createElement('h2', { style: { fontSize: '48px', fontWeight: 900, color: '#000', marginTop: '10px' } }, 'NePaL')
        )
      ),

    React.createElement('div', { style: { height: '40px' } }),
      isModalOpen && React.createElement(
        'div',
        {
          style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          },
          onClick: () => setIsModalOpen(false)
        },
        React.createElement(
          'div',
          {
            style: { background: 'white', padding: '40px', borderRadius: '12px', width: '90%', maxWidth: '400px', position: 'relative' },
            onClick: e => e.stopPropagation()
          },
          React.createElement('button', {
            style: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '30px', cursor: 'pointer' },
            onClick: () => setIsModalOpen(false)
          }, '×'),

          React.createElement('h2', { style: { textAlign: 'center', margin: '0 0 20px' } }, 'Reset Password'),
          React.createElement('p', { style: { textAlign: 'center', color: '#555', marginBottom: '20px' } }, 'Enter your email to get a reset link'),
          React.createElement('input', {
            type: 'email',
            placeholder: 'Your email',
            style: { width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '8px', border: 'none', background: '#000', color: '#888' }
          }),
          React.createElement('button', {
            style: { width: '100%', padding: '14px', background: '#000', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
          }, 'Send Reset Link')
        )
      )
    )
  );
}

export default App;