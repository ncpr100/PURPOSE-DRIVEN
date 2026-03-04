#!/bin/bash
# Direct SQL seed for Hillsong Barranquilla - 2000 members
# Uses psql directly to avoid Prisma/PgBouncer issues

CHURCH_ID="AaS4Pjqrw5viy04ky14Jv"
TIMESTAMP=$(date +%s%N | cut -b1-13)

echo "🚀 SEEDING HILLSONG BARRANQUILLA WITH 2000 MEMBERS"
echo "=================================================================="

# Check existing members
EXISTING=$(PGPASSWORD='Bendecido100%$$%' psql \
  -h aws-1-us-east-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.qxdwpihcmgctznvdfmbv \
  -d postgres \
  -t -c "SELECT COUNT(*) FROM members WHERE \"churchId\" = '$CHURCH_ID'")

echo "Existing members: $EXISTING"

TO_CREATE=$((2000 - EXISTING))
if [ $TO_CREATE -le 0 ]; then
  echo "✅ Already have 2000+ members!"
  exit 0
fi

echo "Creating $TO_CREATE members..."
echo ""

# Spanish names arrays
MALE_NAMES=("Juan" "Carlos" "José" "Miguel" "David" "Diego" "Andrés" "Pedro" "Luis" "Fernando")
FEMALE_NAMES=("María" "Carmen" "Ana" "Isabel" "Laura" "Patricia" "Rosa" "Andrea" "Diana" "Carolina")
LAST_NAMES=("García" "Rodríguez" "Martínez" "López" "González" "Pérez" "Sánchez" "Ramírez" "Torres" "Flores")

# Generate SQL for 2000 members in batches
BATCH_SIZE=100
BATCHES=$(( (TO_CREATE + BATCH_SIZE - 1) / BATCH_SIZE ))

for ((batch=0; batch<BATCHES; batch++)); do
  START=$((batch * BATCH_SIZE))
  END=$((START + BATCH_SIZE))
  if [ $END -gt $TO_CREATE ]; then
    END=$TO_CREATE
  fi
  
  echo "Processing batch $(($batch + 1))/$BATCHES..."
  
  # Build SQL INSERT statement
  SQL="INSERT INTO members (id, \"firstName\", \"lastName\", email, phone, gender, \"birthDate\", address, city, state, country, \"postalCode\", lifecycle, \"membershipStatus\", \"joinDate\", \"churchId\", \"createdAt\", \"updatedAt\") VALUES "
  
  for ((i=START; i<END; i++)); do
    INDEX=$((i + EXISTING))
    
    # Random gender
    if [ $((RANDOM % 2)) -eq 0 ]; then
      GENDER="M"
      FIRST_NAME=${MALE_NAMES[$((RANDOM % 10))]}
    else
      GENDER="F"
      FIRST_NAME=${FEMALE_NAMES[$((RANDOM % 10))]}
    fi
    
    LAST_NAME="${LAST_NAMES[$((RANDOM % 10))]} ${LAST_NAMES[$((RANDOM % 10))]}"
    
    # Lifecycle distribution
    RAND=$((RANDOM % 100))
    if [ $RAND -lt 10 ]; then
      LIFECYCLE="VISITANTE"
    elif [ $RAND -lt 30 ]; then
      LIFECYCLE="NUEVO_CREYENTE"
    elif [ $RAND -lt 65 ]; then
      LIFECYCLE="CRECIMIENTO"
    elif [ $RAND -lt 90 ]; then
      LIFECYCLE="MADURO"
    else
      LIFECYCLE="LIDER"
    fi
    
    # Random dates
    BIRTH_YEAR=$((1940 + RANDOM % 70))
    BIRTH_MONTH=$(printf "%02d" $((1 + RANDOM % 12)))
    BIRTH_DAY=$(printf "%02d" $((1 + RANDOM % 28)))
    
    JOIN_YEAR=$((2018 + RANDOM % 8))
    JOIN_MONTH=$(printf "%02d" $((1 + RANDOM % 12)))
    JOIN_DAY=$(printf "%02d" $((1 + RANDOM % 28)))
    
    # Generate email
    FIRSTNAME_CLEAN=$(echo "$FIRST_NAME" | iconv -f UTF-8 -t ASCII//TRANSLIT | tr '[:upper:]' '[:lower:]')
    LASTNAME_CLEAN=$(echo "${LAST_NAME%% *}" | iconv -f UTF-8 -t ASCII//TRANSLIT | tr '[:upper:]' '[:lower:]')
    EMAIL="${FIRSTNAME_CLEAN}.${LASTNAME_CLEAN}${INDEX}@hillsong.com"
    
    PHONE="+57 3$((10 + RANDOM % 10)) $((100 + RANDOM % 900)) $((1000 + RANDOM % 9000))"
    ADDRESS="Calle $((1 + RANDOM % 200)) #$((10 + RANDOM % 90))-$((10 + RANDOM % 90))"
    POSTAL=$((80000 + RANDOM % 1000))
    
    ID="member-hillsong-${TIMESTAMP}-${INDEX}"
    
    if [ $i -gt $START ]; then
      SQL+=","
    fi
    
    SQL+="('$ID', '$FIRST_NAME', '$LAST_NAME', '$EMAIL', '$PHONE', '$GENDER', '$BIRTH_YEAR-$BIRTH_MONTH-$BIRTH_DAY', '$ADDRESS', 'Barranquilla', 'Atlántico', 'Colombia', '$POSTAL', '$LIFECYCLE', 'ACTIVE', '$JOIN_YEAR-$JOIN_MONTH-$JOIN_DAY', '$CHURCH_ID', NOW(), NOW())"
  done
  
  SQL+=" ON CONFLICT (id) DO NOTHING;"
  
  # Execute SQL
  PGPASSWORD='Bendecido100%$$%' psql \
    -h aws-1-us-east-1.pooler.supabase.com \
    -p 6543 \
    -U postgres.qxdwpihcmgctznvdfmbv \
    -d postgres \
    -c "$SQL" > /dev/null
  
  echo "✅ Batch $(($batch + 1))/$BATCHES completed"
done

# Final count
FINAL=$(PGPASSWORD='Bendecido100%$$%' psql \
  -h aws-1-us-east-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.qxdwpihcmgctznvdfmbv \
  -d postgres \
  -t -c "SELECT COUNT(*) FROM members WHERE \"churchId\" = '$CHURCH_ID'")

echo ""
echo "=================================================================="
echo "🎉 SEED COMPLETE!"
echo "=================================================================="
echo "Total members: $FINAL"
echo ""
echo "✅ Refresh your dashboard to see the data!"
