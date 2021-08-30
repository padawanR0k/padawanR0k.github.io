---
author: [padawanr0k]
title: typescript 환경에서 sequelize 사용하기
date: 2021-08-30
tags: ["javascript"]
layout: post
# image: ../../img/42seoul_title.jpeg
keywords: [sequelize, orm]
---

> 사용했던 경험을 잊지않기 위해 단편적인 내용들을 정리했습니다.

## sequelize.js란?
javascript에서 사용할 수 있는 ORM으로서 가장 대중적으로 사용되고 있음.

### 사용법 정리

#### 설치
```
yarn add sequelize
```

#### 설정
`database.ts`
- 데이터베이스를 연결
  ```typescript
  const sequelize = new Sequelize.Sequelize(databaseName, username, password, {
    host: host,
    dialect: 'mysql',
    port,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      freezeTableName: true
    },
    logQueryParameters: process.env.NODE_ENV === 'development',
    logging: (query, time) => {
      logger.info(time + 'ms' + ' ' + query);
    }
  });

  sequelize.authenticate();
  ```
  - `databaseName`
    - 스키마 이름
  - `host`
    - 데이터베이스가 실행중인 호스트
  - `dialect`
    - 어떤 SQL언어를 사용할 것인지 설정
  - `define`
    - DB 설정
    - `freezeTableName: true` 모든 TableName을 복수형이 아닌 Model을 설정시 입력한 이름 그대로 사용하게 해준다.
  - `logQueryParameters`
    - 로깅을 할것인지 여부
  - `logging`
    - 쿼리가 실행되는 경우 그 쿼리문자열을 전달하여 실행할 콜백함수

- 모델 선언
  ```typescript
  import { Sequelize, DataTypes, Model } from 'sequelize';

  // 테이블에 존재하는 중요 컬럼 인터페이스
  export interface Card {
    cardId: number;
    using: boolean;
    type: number;
    deletedAt: Date;
  }

  // Model.create()시 필요한 컬럼을 지정함
  type CardCreateInterface = Pick<Card, 'type'>;

  export class CardModel extends Model<Card, CardCreateInterface> implements Card {
    public cardId: number;
    public using: boolean;
    public type: number;
    public deletedAt: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  // 모델을 생성하는 함수
  export default function(sequelize: Sequelize): typeof CardModel {
    CardModel.init(
      {
        cardId: {
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        using: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        type: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        deletedAt: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        tableName: 'card', // table 이름 지정
        modelName: 'card', // 모델의 이름 지정
        sequelize,
      }
    );

    return CardModel;
  }
  ```

- 사용하기 쉽도록 객체화 (`typescript-expres-starter` 보일러플레이트 참고함)
  ```typescript
  const DB = {
    sequelize,
    card: CardModel(sequelize),
    config: ConfigModel(sequelize),
    log: LogModel(sequelize),
    user: UserModel(sequelize)
  };

  ...
  // 사용하는곳
  DB.card.findAll({ where: { id: 1 } })
  ```

- 테이블 관계 정의
  ```typescript
  DB.log.belongsTo(DB.card, { foreignKey: 'cardCardId' });
  DB.log.belongsTo(DB.user, { foreignKey: 'user_id' });
  DB.user.hasOne(DB.card, { sourceKey: 'cardId', foreignKey: 'cardId', as: 'card' });
  DB.card.belongsTo(DB.user, { foreignKey: 'cardId', as: 'user' });

  export default DB;
  ```
  - 1:1, 1:N, N:M 관계는 모델의 메서드로 해결한다. `hasOne()`, `hasMany()`, `belongsTo()`, `belongsToMany()` 등이 있으며 자세한 사용법은 다음 [링크](https://gngsn.tistory.com/71) 참조

#### 연결
`app.ts`
```typescript
DB.sequelize.sync({ force: false }).then((connection) => {
  ...
})
```

#### 쿼리
- 간단한 where문
```typescript
const card = await DB.card.findOne({ where: { cardId: 1 } })
```

- join은 `include` 옵션을 사용한다.
  - 관계설정을 하지 않은 테이블끼리는 include시 오류가 발생한다.
  - 일반적인 join
    ```typescript
    const user = await DB.user.findOne({
      where: { _id: id },
      include: [{
        model: DB.card,
        required: false, // false: outer join, true: inner join [https://sequelize.org/master/manual/eager-loading.html#required-eager-loading]
        as: 'card'
      }],
    })
    ```
  - 복합적인 join 1
    ```typescript
    DB.log.findAll({
      include: [
        {
          model: DB.card,
          as: 'card', // 모델에 대한 alias를 as로 항상 지정해줘야한다.
          where: { // join하려는 테이블에게도 where문을 추가할 수 있다
            type: { [Op.eq]: type } // 연산자에 대한 부분들은 Op 객체 내부에 있는 변수를 key값으로 비교할 값을 value로 전달한다.
          }
        },
        {
          model: DB.user,
          as: 'user'
        }
      ],
      order: [ [ 'createdAt', 'DESC' ] ], // 정렬에 대한 부분은 배열로 전달해야한다.
      offset: 50 * page,
      limit: 50
    });
    ```
  - 복합적인 join 2
    ```typescript
    DB.log.findAll({
      include: [ DB.log.associations.user, DB.log.associations.card ],
      where: {
        [Op.and]: [
          // sequelize를 다루는게 익숙하지 않은 경우 문자열을 그대로 전달하는것도 가능하다.
          Sequelize.literal('`user`.`cardId` = `card`.`cardId`'),
          Sequelize.literal('`card`.`type` = ' + type)
        ]
      },
      order: [ [ 'createdAt', 'DESC' ] ]
    });
    ```
