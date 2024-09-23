import React from 'react';
import Card from 'react-bootstrap/Card';

const Landingpage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
      <Card style={{ width: '28rem' }} className="shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105 duration-300">
        <Card.Body className="p-6">
          <Card.Title className="text-3xl font-bold text-gray-800">
            New England Mountain Minder
          </Card.Title>
          <Card.Subtitle className="mb-4 text-lg text-gray-500">
            A Place For Winter Sports.
          </Card.Subtitle>
          <Card.Text className="text-gray-700 text-base leading-relaxed">
            Enjoy Your Experience! Stay updated with real-time weather, lift statuses, and mountain information.
          </Card.Text>
          <div className="mt-5 flex justify-between">
            <Card.Link href="/signup" className="text-blue-500 font-semibold hover:text-blue-700 transition">
              Sign Up
            </Card.Link>
            <Card.Link href="/login" className="text-blue-500 font-semibold hover:text-blue-700 transition">
              Login
            </Card.Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Landingpage;
